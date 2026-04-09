import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    const { data: userData, error } = await supabase
      .from("users")
      .select("subscription_credits, bonus_credits, subscription_status, price_id")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user credits:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json({
          credits: 0,
          subscriptionStatus: "inactive",
          priceId: null,
        });
      }

      return NextResponse.json(
        { error: "Failed to fetch credits" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      credits:
        ((userData.subscription_credits as number | null) ?? 0) +
        ((userData.bonus_credits as number | null) ?? 0),
      subscriptionStatus: userData.subscription_status,
      priceId: userData.price_id,
    });
  } catch (error) {
    console.error("Credits API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
