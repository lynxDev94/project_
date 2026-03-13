import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Client } from "@langchain/langgraph-sdk";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

function extractAssistantText(runResult: any): string {
  const containers = [
    runResult?.output,
    runResult?.state,
    runResult?.values,
    runResult,
  ];

  for (const container of containers) {
    const messages = container?.messages;
    if (!Array.isArray(messages)) continue;

    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const msg = messages[i];
      if (msg?.role !== "assistant" && msg?.type !== "ai") continue;

      const content = msg?.content;
      if (typeof content === "string") return content;
      if (Array.isArray(content)) {
        const text = content
          .map((part: any) => (typeof part?.text === "string" ? part.text : ""))
          .join("\n")
          .trim();
        if (text) return text;
      }
      if (typeof msg?.kwargs?.content === "string") {
        return msg.kwargs.content;
      }
    }
  }

  return "";
}

function buildAnalysisPrompt(entry: { title: string; body: string; tags: string[] }) {
  return [
    "Analyze this journal entry using Jungian framing and your KB tool.",
    "Follow the required JSON output format exactly.",
    "",
    `Title: ${entry.title || "Untitled reflection"}`,
    `Tags: ${(entry.tags ?? []).join(", ") || "none"}`,
    "Body:",
    entry.body || "(empty entry)",
  ].join("\n");
}

/** POST /api/entries/[id]/analysis - Run Jungian analysis for one entry */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const assistantId = process.env.NEXT_PUBLIC_ASSISTANT_ID || "agent";
    if (!apiUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_API_URL configuration" },
        { status: 500 },
      );
    }

    const client = new Client({
      apiUrl,
      defaultHeaders: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
            "x-supabase-access-token": accessToken,
          }
        : undefined,
    });

    const thread = await (client.threads as any).create();
    const prompt = buildAnalysisPrompt(entry);

    const runResult = await (client.runs as any).wait(thread.thread_id, assistantId, {
      input: {
        messages: [{ role: "user", content: prompt }],
      },
      config: {
        configurable: {
          analysisMode: true,
        },
      },
    });

    const assistantText = extractAssistantText(runResult);
    if (!assistantText) {
      return NextResponse.json(
        { error: "AI analysis returned empty output" },
        { status: 502 },
      );
    }

    const parsed = AnalysisSchema.safeParse(JSON.parse(stripCodeFences(assistantText)));
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid analysis payload shape",
          details: parsed.error.flatten(),
          raw: assistantText,
        },
        { status: 502 },
      );
    }

    const lowConfidence = parsed.data.citations.length === 0;

    return NextResponse.json({
      analysis: parsed.data,
      lowConfidence,
    });
  } catch (err) {
    console.error("Entry analysis POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
