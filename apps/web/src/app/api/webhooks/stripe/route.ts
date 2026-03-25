import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/auth/supabase-server";
import {
  getCreditLimitByPriceId,
  SHADOW_JOURNAL_ONE_TIME,
  CHECKOUT_KIND_EXTRA_ANALYSIS,
} from "@/lib/stripe-config";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature") || "";

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  console.log(`Received webhook event: ${event.type}`);

  // Helper to update user from subscription
  async function updateUserFromSubscription(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    let userId = subscription.metadata.userId;
    if (!userId) {
      try {
        const customer = await stripe.customers.retrieve(
          subscription.customer as string,
        );
        if (customer && !customer.deleted)
          userId = customer.metadata.userId;
      } catch (err) {
        console.error("Error fetching customer:", err);
      }
    }
    if (!userId) {
      const { data } = await supabaseServer
        .from("users")
        .select("id")
        .eq("stripe_customer_id", subscription.customer as string)
        .single();
      if (data) userId = data.id;
    }
    if (!userId) {
      throw new Error("Could not find userId for subscription");
    }

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

    const creditsAvailable =
      subscription.status === "active"
        ? getCreditLimitByPriceId(
            subscription.items.data[0].price.id,
          )
        : 0;

    const updateData = {
      id: userId,
      email: customerEmail,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      subscription_status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      credits_available: creditsAvailable,
      current_period_end: (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000).toISOString()
        : null,
    };

    const { error } = await supabaseServer.from("users").upsert(updateData, {
      onConflict: "id",
    });
    if (error) throw new Error(`Database update failed: ${error.message}`);
    console.log("Successfully updated user subscription for:", userId);
  }

  // Handle the event
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
            .select("credits_available")
            .eq("id", userId)
            .single();
          if (fetchErr) {
            console.error("Failed to fetch user for credit top-up:", fetchErr);
            break;
          }
          const add = SHADOW_JOURNAL_ONE_TIME.EXTRA_ANALYSIS_CREDITS;
          const next =
            ((row?.credits_available as number) ?? 0) + add;
          const { error: upErr } = await supabaseServer
            .from("users")
            .update({ credits_available: next })
            .eq("id", userId);
          if (upErr) {
            console.error("Failed to add one-time credits:", upErr);
          } else {
            console.log(
              `Added ${add} credit(s) for user ${userId} (one-time purchase)`,
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

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("Processing subscription:", subscription.id);
      await updateUserFromSubscription(subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const deletedSubscription = event.data.object as Stripe.Subscription;
      let deletedUserId = deletedSubscription.metadata.userId;
      if (!deletedUserId) {
        const { data } = await supabaseServer
          .from("users")
          .select("id")
          .eq("stripe_subscription_id", deletedSubscription.id)
          .single();
        deletedUserId = data?.id;
      }

      if (deletedUserId) {
        const { error } = await supabaseServer
          .from("users")
          .update({
            subscription_status: "canceled",
            credits_available: 0,
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

  return NextResponse.json({ received: true });
}
