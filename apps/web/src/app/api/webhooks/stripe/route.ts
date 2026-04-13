import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/auth/supabase-server";
import {
  claimStripeSubscriptionCreditEvent,
  refillSubscriptionCredits,
} from "@/lib/credits-server";
import {
  getCreditLimitByPriceId,
  SHADOW_JOURNAL_ONE_TIME,
  CHECKOUT_KIND_EXTRA_ANALYSIS,
} from "@/lib/stripe-config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

async function resolveUserIdFromSubscription(
  subscription: Stripe.Subscription,
): Promise<string | null> {
  let userId: string | undefined = subscription.metadata?.userId;
  if (!userId) {
    try {
      const customer = await stripe.customers.retrieve(
        subscription.customer as string,
      );
      if (customer && !customer.deleted && "metadata" in customer)
        userId = customer.metadata?.userId;
    } catch (err) {
      console.error("resolveUserIdFromSubscription: customer fetch", err);
    }
  }
  if (!userId) {
    const { data } = await supabaseServer
      .from("users")
      .select("id")
      .eq("stripe_customer_id", subscription.customer as string)
      .maybeSingle();
    if (data) userId = data.id;
  }
  return userId ?? null;
}

function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const details = invoice.parent?.subscription_details;
  if (details?.subscription) {
    return typeof details.subscription === "string"
      ? details.subscription
      : details.subscription.id;
  }
  const legacy = (
    invoice as Stripe.Invoice & {
      subscription?: string | Stripe.Subscription | null;
    }
  ).subscription;
  if (legacy) {
    return typeof legacy === "string" ? legacy : legacy.id;
  }
  return null;
}

async function updateUserFromSubscription(
  subscription: Stripe.Subscription,
): Promise<void> {
  const userId = await resolveUserIdFromSubscription(subscription);
  if (!userId) throw new Error("Could not find userId for subscription");

  let customerEmail: string | null = null;
  try {
    const customer = await stripe.customers.retrieve(
      subscription.customer as string,
    );
    if (customer && !customer.deleted && customer.email)
      customerEmail = customer.email;
  } catch {
    /* ignore */
  }
  if (!customerEmail) {
    const { data } = await supabaseServer
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();
    customerEmail = data?.email ?? null;
  }

  const paid =
    subscription.status === "active" || subscription.status === "trialing";

  const item0 = subscription.items.data[0];
  const periodEnd = item0?.current_period_end ?? null;

  const updatePayload: Record<string, unknown> = {
    email: customerEmail,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    subscription_status: subscription.status,
    current_period_end: periodEnd
      ? new Date(periodEnd * 1000).toISOString()
      : null,
  };
  if (item0?.price?.id) {
    updatePayload.price_id = item0.price.id;
  }

  if (!paid) {
    updatePayload.subscription_credits = 0;
  }

  const { error } = await supabaseServer
    .from("users")
    .update(updatePayload)
    .eq("id", userId);

  if (error) throw new Error(`Database update failed: ${error.message}`);
  console.log("Updated user subscription metadata for:", userId);
}

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Webhook Error: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  console.log(`Received webhook event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "payment") {
          const kind = session.metadata?.checkoutKind;
          const userId = session.metadata?.userId;
          const expectedPrice = SHADOW_JOURNAL_ONE_TIME.EXTRA_ANALYSIS_PRICE_ID;
          if (
            kind === CHECKOUT_KIND_EXTRA_ANALYSIS &&
            userId &&
            expectedPrice
          ) {
            const full = await stripe.checkout.sessions.retrieve(session.id, {
              expand: ["line_items.data.price"],
            });
            const paidPriceId =
              full.line_items?.data[0]?.price &&
              typeof full.line_items.data[0].price !== "string"
                ? full.line_items.data[0].price.id
                : null;
            if (paidPriceId !== expectedPrice) {
              console.error(
                "One-time checkout price mismatch:",
                paidPriceId,
                expectedPrice,
              );
              break;
            }
            const { data: row, error: fetchErr } = await supabaseServer
              .from("users")
              .select("bonus_credits")
              .eq("id", userId)
              .single();
            if (fetchErr) {
              console.error(
                "Failed to fetch user for credit top-up:",
                fetchErr,
              );
              break;
            }
            const add = SHADOW_JOURNAL_ONE_TIME.EXTRA_ANALYSIS_CREDITS;
            const nextBonus = ((row?.bonus_credits as number) ?? 0) + add;
            const { error: upErr } = await supabaseServer
              .from("users")
              .update({ bonus_credits: nextBonus })
              .eq("id", userId);
            if (upErr) {
              console.error("Failed to add one-time credits:", upErr);
            } else {
              console.log(
                `Added ${add} bonus credit(s) for user ${userId} (one-time purchase)`,
              );
            }
          }
          break;
        }

        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
          );
          await updateUserFromSubscription(subscription);
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = getSubscriptionIdFromInvoice(invoice);
        if (!subId) break;

        const br = invoice.billing_reason;
        if (br !== "subscription_create" && br !== "subscription_cycle") {
          break;
        }

        const claimed = await claimStripeSubscriptionCreditEvent(
          `inv:${invoice.id}`,
        );
        if (!claimed) break;

        const subscription = await stripe.subscriptions.retrieve(subId);
        const userId = await resolveUserIdFromSubscription(subscription);
        if (!userId) {
          console.error("invoice.paid: could not resolve user for", subId);
          break;
        }

        const priceId = subscription.items.data[0]?.price.id;
        const cap = getCreditLimitByPriceId(priceId);
        await refillSubscriptionCredits(userId, cap);
        console.log(
          `Refilled subscription_credits to ${cap} for user ${userId} (invoice ${invoice.id})`,
        );
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Processing subscription:", subscription.id);
        await updateUserFromSubscription(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const deletedSubscription = event.data.object as Stripe.Subscription;
        let deletedUserId = deletedSubscription.metadata?.userId;
        if (!deletedUserId) {
          const { data } = await supabaseServer
            .from("users")
            .select("id")
            .eq("stripe_subscription_id", deletedSubscription.id)
            .maybeSingle();
          deletedUserId = data?.id;
        }

        if (deletedUserId) {
          const { error } = await supabaseServer
            .from("users")
            .update({
              subscription_status: "canceled",
              subscription_credits: 0,
            })
            .eq("stripe_subscription_id", deletedSubscription.id);

          if (error) {
            console.error("Error updating user subscription:", error);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (e) {
    console.error("Stripe webhook handler error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Webhook handler failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
