import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseServer } from "@/lib/auth/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(_request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: row, error: userError } = await supabaseServer
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (userError || !row?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No billing account found. Subscribe to a plan first." },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.billingPortal.sessions.create({
      customer: row.stripe_customer_id as string,
      return_url: `${baseUrl}/dashboard/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("create-portal-session:", e);
    return NextResponse.json(
      { error: "Failed to open billing portal" },
      { status: 500 },
    );
  }
}
