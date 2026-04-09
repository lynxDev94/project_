import { supabaseServer } from "@/lib/auth/supabase-server";

export type CreditPoolDelta = { sub: number; bonus: number };

export type DeductCreditsResult =
  | { ok: true; newBalance: number; refund: CreditPoolDelta }
  | { ok: false };

type UserCreditRow = {
  id: string;
  subscription_credits: number | null;
  bonus_credits: number | null;
};

export type LlmUsageEvent = {
  userId: string;
  entryId: string | null;
  source: "analysis";
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
};

export type MonthlyUsageSummary = {
  totalTokens: number;
  totalCostUsd: number;
  periodStartIso: string;
};

const DEFAULT_MONTHLY_TOKEN_LIMIT = 250_000;
const DEFAULT_MONTHLY_COST_LIMIT_USD = 20;

function getMonthStartUtcIso(): string {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  return start.toISOString();
}

async function getUserCreditRow(userId: string): Promise<UserCreditRow> {
  const { data: currentUser, error: fetchError } = await supabaseServer
    .from("users")
    .select("id, subscription_credits, bonus_credits")
    .eq("id", userId)
    .single();

  if (fetchError) throw fetchError;
  return currentUser as UserCreditRow;
}

/** Deduct credits (subscription pool first, then bonus) with optimistic-concurrency retries. */
export async function deductUserCreditsServer(
  userId: string,
  creditsToDeduct: number,
): Promise<DeductCreditsResult> {
  const maxAttempts = 4;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const currentUser = await getUserCreditRow(userId);
  const sub = (currentUser?.subscription_credits as number) ?? 0;
  const bonus = (currentUser?.bonus_credits as number) ?? 0;
  const currentBalance = sub + bonus;
  if (currentBalance < creditsToDeduct) {
    return { ok: false };
  }

  let newSub = sub;
  let newBonus = bonus;
  let remaining = creditsToDeduct;
  if (remaining <= sub) {
    newSub = sub - remaining;
  } else {
    remaining -= sub;
    newSub = 0;
    newBonus = bonus - remaining;
  }

    const { data, error } = await supabaseServer
    .from("users")
    .update({
      subscription_credits: newSub,
      bonus_credits: newBonus,
    })
      .eq("id", userId)
      .eq("subscription_credits", sub)
      .eq("bonus_credits", bonus)
      .select("id");

    if (error) throw error;
    if ((data?.length ?? 0) > 0) {
      return {
        ok: true,
        newBalance: newSub + newBonus,
        refund: { sub: sub - newSub, bonus: bonus - newBonus },
      };
    }
  }

  return { ok: false };
}

/** Restore credits after a failed paid operation (mirrors prior deduction pools). */
export async function refundUserCreditsServer(
  userId: string,
  refund: CreditPoolDelta,
): Promise<void> {
  if (refund.sub === 0 && refund.bonus === 0) return;

  const maxAttempts = 4;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const row = await getUserCreditRow(userId);
    const sub = (row?.subscription_credits as number) ?? 0;
    const bonus = (row?.bonus_credits as number) ?? 0;

    const { data, error } = await supabaseServer
      .from("users")
      .update({
        subscription_credits: sub + refund.sub,
        bonus_credits: bonus + refund.bonus,
      })
      .eq("id", userId)
      .eq("subscription_credits", sub)
      .eq("bonus_credits", bonus)
      .select("id");

    if (error) throw error;
    if ((data?.length ?? 0) > 0) return;
  }

  throw new Error("Failed to refund credits due to concurrent updates");
}

/** Returns false if this id was already processed (idempotent webhook handling). */
export async function claimStripeSubscriptionCreditEvent(id: string): Promise<boolean> {
  const { error } = await supabaseServer
    .from("stripe_subscription_credit_events")
    .insert({ id });

  if (!error) return true;
  if (error.code === "23505") return false;
  console.error("claimStripeSubscriptionCreditEvent:", error);
  return false;
}

export async function refillSubscriptionCredits(userId: string, planCap: number): Promise<void> {
  const { error } = await supabaseServer
    .from("users")
    .update({ subscription_credits: planCap })
    .eq("id", userId);

  if (error) throw new Error(`refillSubscriptionCredits: ${error.message}`);
}

export async function getMonthlyLlmUsageSummary(userId: string): Promise<MonthlyUsageSummary> {
  const periodStartIso = getMonthStartUtcIso();
  const { data, error } = await supabaseServer
    .from("llm_usage_events")
    .select("total_tokens, estimated_cost_usd")
    .eq("user_id", userId)
    .gte("created_at", periodStartIso);

  if (error) throw error;

  const totalTokens = (data ?? []).reduce(
    (sum, row) => sum + ((row.total_tokens as number | null) ?? 0),
    0,
  );
  const totalCostUsd = (data ?? []).reduce(
    (sum, row) => sum + ((row.estimated_cost_usd as number | null) ?? 0),
    0,
  );

  return { totalTokens, totalCostUsd, periodStartIso };
}

export async function isWithinMonthlyLlmLimits(userId: string): Promise<{
  ok: true;
} | {
  ok: false;
  reason: string;
}> {
  const tokenLimit = Number(process.env.AI_MONTHLY_TOKEN_LIMIT ?? DEFAULT_MONTHLY_TOKEN_LIMIT);
  const costLimit = Number(
    process.env.AI_MONTHLY_COST_LIMIT_USD ?? DEFAULT_MONTHLY_COST_LIMIT_USD,
  );
  const usage = await getMonthlyLlmUsageSummary(userId);
  if (usage.totalTokens >= tokenLimit) {
    return {
      ok: false,
      reason: "Monthly AI token limit reached. Please contact support or upgrade.",
    };
  }
  if (usage.totalCostUsd >= costLimit) {
    return {
      ok: false,
      reason: "Monthly AI spend limit reached. Please contact support or upgrade.",
    };
  }
  return { ok: true };
}

export async function recordLlmUsageEvent(event: LlmUsageEvent): Promise<void> {
  const { error } = await supabaseServer.from("llm_usage_events").insert({
    user_id: event.userId,
    entry_id: event.entryId,
    source: event.source,
    model: event.model,
    input_tokens: event.inputTokens,
    output_tokens: event.outputTokens,
    total_tokens: event.totalTokens,
    estimated_cost_usd: event.estimatedCostUsd,
  });
  if (error) throw error;
}
