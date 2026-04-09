import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/auth/supabase-server";
import {
  SHADOW_JOURNAL_ONE_TIME,
  SHADOW_JOURNAL_PRICE_IDS,
} from "@/lib/stripe-config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { applyRateLimit } from "@/lib/rate-limit";

type SessionCreateParams = Stripe.Checkout.SessionCreateParams;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = applyRateLimit({
      key: `checkout:${user.id}`,
      windowMs: 60_000,
      maxRequests: 8,
    });
    if (!rateLimit.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { priceId, mode = "subscription" } = body as {
      priceId: string;
      mode?: "subscription" | "payment";
    };
    const userId = user.id;
    const customerEmail = user.email;

    if (!priceId || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Verify Stripe is initialized
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 },
      );
    }

    // Get or create Stripe customer
    let customerId: string;

    // Check if user already has a Stripe customer ID
    const { data: userData, error: userError } = await supabaseServer
      .from("users")
      .select("stripe_customer_id, email")
      .eq("id", userId)
      .single();

    if (userError && userError.code !== "PGRST116") {
      console.error("Error fetching user:", userError);
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 },
      );
    }

    if (userData?.stripe_customer_id) {
      customerId = userData.stripe_customer_id as string;
      console.log("Using existing Stripe customer:", customerId);
    } else {
      // Create a new customer
      console.log("Creating new Stripe customer for:", customerEmail);
      const customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          userId,
        },
      });

      customerId = customer.id;
      console.log("Created new Stripe customer:", customerId);

      // Create or update user record in Supabase
      const { error: updateError } = await supabaseServer.from("users").upsert(
        {
          id: userId,
          email: customerEmail,
          stripe_customer_id: customerId,
          subscription_credits: 0,
          bonus_credits: 0,
          subscription_status: "inactive",
        },
        {
          onConflict: "id",
        },
      );

      if (updateError) {
        console.error("Error creating/updating user record:", updateError);
        // Don't fail the checkout, but log the error
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const allowedOneTimePrice = SHADOW_JOURNAL_ONE_TIME.EXTRA_ANALYSIS_PRICE_ID;
    const allowedSubscriptionPrices = new Set([
      SHADOW_JOURNAL_PRICE_IDS.REFLECT,
      SHADOW_JOURNAL_PRICE_IDS.INITIATE,
    ]);

    let sessionParams: SessionCreateParams;

    if (mode === "payment") {
      if (!allowedOneTimePrice || priceId !== allowedOneTimePrice) {
        return NextResponse.json(
          { error: "Invalid one-time purchase" },
          { status: 400 },
        );
      }
      sessionParams = {
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "payment",
        success_url: `${baseUrl}/dashboard/pricing?extra_analysis=success`,
        cancel_url: `${baseUrl}/dashboard/pricing`,
        metadata: {
          userId,
          checkoutKind: "extra_analysis",
        },
      };
    } else {
      if (!allowedSubscriptionPrices.has(priceId)) {
        return NextResponse.json(
          { error: "Invalid subscription price" },
          { status: 400 },
        );
      }
      sessionParams = {
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/dashboard/pricing`,
        metadata: {
          userId,
        },
        subscription_data: {
          metadata: {
            userId,
          },
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
