import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Client } from "@langchain/langgraph-sdk";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  deductUserCreditsServer,
  isWithinMonthlyLlmLimits,
  recordLlmUsageEvent,
  refundUserCreditsServer,
  type CreditPoolDelta,
} from "@/lib/credits-server";
import { applyRateLimit } from "@/lib/rate-limit";

const ANALYSIS_CREDIT_COST = 1;

const CitationSchema = z.object({
  source: z.string().min(1),
  chunkId: z.number().int(),
  preview: z.string(),
});

const AnalysisSchema = z.object({
  reflection: z.string().min(1),
  jungianThemes: z.array(z.string().min(1)).min(1),
  interpretation: z.string().min(1),
  deepQuestions: z.array(z.string().min(1)).min(2).max(3),
  shadowExercise: z.string().min(1),
  citations: z.array(CitationSchema),
});

function stripCodeFences(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  return trimmed;
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

/** OpenAI / provider quota or billing (429). */
function isModelQuotaError(err: unknown): boolean {
  const m = errorMessage(err);
  return (
    m.includes("InsufficientQuotaError") ||
    m.includes("exceeded your current quota") ||
    (/429/.test(m) && m.toLowerCase().includes("quota"))
  );
}

function buildAnalysisPrompt(entry: {
  title: string;
  body: string;
  tags: string[];
}) {
  return [
    "Analyze this journal entry using Jungian framing.",
    "Follow the required JSON output format exactly with valid JSON object output.",
    "",
    `Title: ${entry.title || "Untitled reflection"}`,
    `Tags: ${(entry.tags ?? []).join(", ") || "none"}`,
    "Body:",
    entry.body || "(empty entry)",
  ].join("\n");
}

type LangGraphAnalysisResult = {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

function estimateCostUsd(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  // Approximate rates; tune to your provider/model pricing.
  const rates: Record<string, { input: number; output: number }> = {
    "gpt-4o-mini": { input: 0.15 / 1_000_000, output: 0.6 / 1_000_000 },
    "gpt-4.1-mini": { input: 0.4 / 1_000_000, output: 1.6 / 1_000_000 },
  };
  const selected = rates[model] ?? rates["gpt-4o-mini"];
  return Number(
    (inputTokens * selected.input + outputTokens * selected.output).toFixed(8),
  );
}

function getContentFromMessage(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((part: unknown) => {
      if (typeof part === "string") return part;
      if (
        part &&
        typeof part === "object" &&
        "text" in part &&
        typeof (part as { text?: unknown }).text === "string"
      ) {
        return (part as { text: string }).text;
      }
      return "";
    })
    .join("\n")
    .trim();
}

function parseTokenUsage(message: unknown) {
  if (!message || typeof message !== "object") {
    return {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      model: "langgraph-agent",
    };
  }
  const m = message as Record<string, unknown>;
  const usage = (m.usage_metadata as Record<string, unknown> | undefined) ?? {};
  const responseMeta =
    (m.response_metadata as Record<string, unknown> | undefined) ?? {};
  const tokenUsage =
    (responseMeta.token_usage as Record<string, unknown> | undefined) ?? {};

  const inputTokens =
    Number(
      usage.input_tokens ??
        tokenUsage.prompt_tokens ??
        tokenUsage.input_tokens ??
        0,
    ) || 0;
  const outputTokens =
    Number(
      usage.output_tokens ??
        tokenUsage.completion_tokens ??
        tokenUsage.output_tokens ??
        0,
    ) || 0;
  const totalTokens =
    Number(
      usage.total_tokens ??
        tokenUsage.total_tokens ??
        inputTokens + outputTokens,
    ) || 0;
  const model =
    (responseMeta.model_name as string | undefined) ||
    (responseMeta.model as string | undefined) ||
    "langgraph-agent";

  return { inputTokens, outputTokens, totalTokens, model };
}

function extractAssistantFromRun(runResult: unknown): LangGraphAnalysisResult {
  const containers = [
    runResult as Record<string, unknown>,
    (runResult as { output?: Record<string, unknown> } | null)?.output,
    (runResult as { state?: Record<string, unknown> } | null)?.state,
    (runResult as { values?: Record<string, unknown> } | null)?.values,
  ];

  for (const container of containers) {
    const messages = container?.messages;
    if (!Array.isArray(messages)) continue;
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const msg = messages[i];
      if (!msg || typeof msg !== "object") continue;
      const typed = msg as Record<string, unknown>;
      const role = typed.role;
      const type = typed.type;
      if (role !== "assistant" && type !== "ai") continue;

      const text = getContentFromMessage(typed.content);
      const usage = parseTokenUsage(typed);
      if (text) {
        return {
          content: text,
          model: usage.model,
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
        };
      }
    }
  }

  throw new Error("AI analysis returned empty output");
}

async function runLangGraphAnalysis(input: {
  prompt: string;
  accessToken: string;
}): Promise<LangGraphAnalysisResult> {
  const apiUrl =
    process.env.LANGGRAPH_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim();
  const assistantId =
    process.env.LANGGRAPH_ASSISTANT_ID?.trim() ||
    process.env.NEXT_PUBLIC_ASSISTANT_ID?.trim() ||
    "agent";

  if (!apiUrl) {
    throw new Error("Missing LANGGRAPH_API_URL configuration");
  }

  const client = new Client({
    apiUrl,
    defaultHeaders: {
      Authorization: `Bearer ${input.accessToken}`,
      "x-supabase-access-token": input.accessToken,
    },
  });

  const thread = await (client.threads as any).create();
  const runResult = await (client.runs as any).wait(
    thread.thread_id,
    assistantId,
    {
      input: {
        messages: [{ role: "user", content: input.prompt }],
      },
      config: {
        configurable: {
          analysisMode: true,
        },
      },
    },
  );

  return extractAssistantFromRun(runResult);
}

/** POST /api/entries/[id]/analysis - Run Jungian analysis for one entry */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  let userIdForRefund: string | null = null;
  let poolRefund: CreditPoolDelta | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in." },
        { status: 401 },
      );
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Missing access token." },
        { status: 401 },
      );
    }

    userIdForRefund = user.id;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const userWindowLimit = applyRateLimit({
      key: `analysis:user:${user.id}`,
      windowMs: 60_000,
      maxRequests: 12,
    });
    const ipWindowLimit = applyRateLimit({
      key: `analysis:ip:${ip}`,
      windowMs: 60_000,
      maxRequests: 30,
    });
    if (!userWindowLimit.ok || !ipWindowLimit.ok) {
      return NextResponse.json(
        {
          error: "Too many analysis requests. Please wait a minute and retry.",
        },
        { status: 429 },
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing entry id" }, { status: 400 });
    }

    const { data: entry, error: entryError } = await supabase
      .from("entries")
      .select("id, title, body, tags")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (entryError || !entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const usageLimitStatus = await isWithinMonthlyLlmLimits(user.id);
    if (!usageLimitStatus.ok) {
      return NextResponse.json(
        {
          error: "Monthly AI limit reached",
          message: usageLimitStatus.reason,
        },
        { status: 429 },
      );
    }

    const deduct = await deductUserCreditsServer(user.id, ANALYSIS_CREDIT_COST);
    if (!deduct.ok) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          message:
            "You need at least one credit to run AI analysis. Upgrade your plan or buy an extra analysis.",
        },
        { status: 402 },
      );
    }

    poolRefund = deduct.refund;

    const safeRefund = async () => {
      if (!userIdForRefund || !poolRefund) return;
      const r = poolRefund;
      poolRefund = null;
      try {
        await refundUserCreditsServer(userIdForRefund, r);
      } catch (re) {
        console.error("Failed to refund analysis credit:", re);
      }
    };

    const prompt = buildAnalysisPrompt(entry);
    const analysisResult = await runLangGraphAnalysis({
      prompt,
      accessToken,
    });
    const assistantText = analysisResult.content;

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(stripCodeFences(assistantText));
    } catch {
      await safeRefund();
      return NextResponse.json(
        { error: "Invalid analysis JSON from model" },
        { status: 502 },
      );
    }

    const parsed = AnalysisSchema.safeParse(parsedJson);
    if (!parsed.success) {
      await safeRefund();
      return NextResponse.json(
        {
          error: "Invalid analysis payload shape",
          details: parsed.error.flatten(),
        },
        { status: 502 },
      );
    }

    const lowConfidence = parsed.data.citations.length === 0;

    await recordLlmUsageEvent({
      userId: user.id,
      entryId: entry.id as string,
      source: "analysis",
      model: analysisResult.model,
      inputTokens: analysisResult.inputTokens,
      outputTokens: analysisResult.outputTokens,
      totalTokens: analysisResult.totalTokens,
      estimatedCostUsd: estimateCostUsd(
        analysisResult.model,
        analysisResult.inputTokens,
        analysisResult.outputTokens,
      ),
    });

    poolRefund = null;

    return NextResponse.json({
      analysis: parsed.data,
      lowConfidence,
    });
  } catch (err) {
    if (userIdForRefund && poolRefund) {
      try {
        await refundUserCreditsServer(userIdForRefund, poolRefund);
      } catch (re) {
        console.error("Failed to refund analysis credit after error:", re);
      }
      poolRefund = null;
    }
    console.error("Entry analysis POST error:", err);

    if (isModelQuotaError(err)) {
      return NextResponse.json(
        {
          error: "AI provider quota exceeded",
          message:
            "OpenAI reported insufficient quota or billing limits (often 429). Add billing or credits on your OpenAI account, or wait if you hit a rate limit. Your analysis credit was refunded.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
