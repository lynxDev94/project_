import Stripe from "stripe";
import { supabaseServer } from "@/lib/auth/supabase-server";

/** Match webhook / checkout Stripe client version. */
const STRIPE_API_VERSION = "2025-04-30.basil" as const;

/** Subscription statuses we attempt to end immediately when the app user deletes their account. */
const STRIPE_STATUSES_TO_CANCEL: Stripe.Subscription.Status[] = [
  "active",
  "trialing",
  "past_due",
  "unpaid",
  "paused",
  "incomplete",
];

function stripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { apiVersion: STRIPE_API_VERSION });
}

async function cancelSubscriptionIfNeeded(
  stripe: Stripe,
  subscriptionId: string,
): Promise<void> {
  try {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    if (!STRIPE_STATUSES_TO_CANCEL.includes(sub.status)) return;
    await stripe.subscriptions.cancel(subscriptionId);
    console.log(
      "Canceled Stripe subscription for deleted account:",
      subscriptionId,
    );
  } catch (e) {
    console.error("Failed to cancel Stripe subscription:", subscriptionId, e);
  }
}

/**
 * Best-effort: cancel billing so the user is not charged after account deletion.
 * Reads `users` row; call before deleting the auth user (row may be removed by cascade).
 */
export async function cancelStripeSubscriptionsForAppUser(
  userId: string,
): Promise<void> {
  const stripe = stripeClient();
  if (!stripe) {
    console.warn(
      "STRIPE_SECRET_KEY missing; skipped Stripe cancel on account delete",
    );
    return;
  }

  const { data: row, error } = await supabaseServer
    .from("users")
    .select("stripe_customer_id, stripe_subscription_id")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("delete-account: could not load user Stripe ids:", error);
    return;
  }

  const customerId = row?.stripe_customer_id as string | undefined;
  const storedSubId = row?.stripe_subscription_id as string | undefined;

  const seen = new Set<string>();
  if (storedSubId) {
    seen.add(storedSubId);
    await cancelSubscriptionIfNeeded(stripe, storedSubId);
  }

  if (customerId) {
    try {
      const list = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 100,
      });
      for (const sub of list.data) {
        if (seen.has(sub.id)) continue;
        seen.add(sub.id);
        await cancelSubscriptionIfNeeded(stripe, sub.id);
      }
    } catch (e) {
      console.error(
        "Stripe list subscriptions for customer failed:",
        customerId,
        e,
      );
    }
  }
}
