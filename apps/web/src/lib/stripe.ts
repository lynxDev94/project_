import { supabase } from "@/lib/auth/supabase-client";

type CheckoutSessionParams = {
  priceId: string;
  mode?: "subscription" | "payment";
};

export async function createCheckoutSession({
  priceId,
  mode = "subscription",
}: CheckoutSessionParams) {
  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
        mode,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create checkout session");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

export async function createBillingPortalSession(): Promise<{ url: string }> {
  const response = await fetch("/api/create-portal-session", {
    method: "POST",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error || "Could not open billing portal",
    );
  }
  return response.json();
}

export async function getCustomerSubscription(userId: string) {
  try {
    // Call your API route that fetches the customer's subscription
    const response = await fetch(`/api/subscriptions?userId=${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch subscription");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching subscription:", error);
    throw error;
  }
}

export async function addUserCredits(userId: string, creditsToAdd: number) {
  try {
    const { data: currentUser } = await supabase
      .from("users")
      .select("subscription_credits, bonus_credits")
      .eq("id", userId)
      .single();

    const sub = (currentUser?.subscription_credits as number) ?? 0;
    const bonus = (currentUser?.bonus_credits as number) ?? 0;
    const newSub = sub + creditsToAdd;

    const { error } = await supabase
      .from("users")
      .update({
        subscription_credits: newSub,
        bonus_credits: bonus,
      })
      .eq("id", userId);

    if (error) throw error;

    return { success: true, newBalance: newSub + bonus };
  } catch (error) {
    console.error("Error adding user credits:", error);
    throw error;
  }
}

export async function deductUserCredits(
  userId: string,
  creditsToDeduct: number,
) {
  try {
    const { data: currentUser, error: fetchError } = await supabase
      .from("users")
      .select("subscription_credits, bonus_credits")
      .eq("id", userId)
      .single();

    if (fetchError) throw fetchError;

    const sub = (currentUser?.subscription_credits as number) ?? 0;
    const bonus = (currentUser?.bonus_credits as number) ?? 0;
    const currentBalance = sub + bonus;
    if (currentBalance < creditsToDeduct) {
      throw new Error("Insufficient credits");
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

    const { error } = await supabase
      .from("users")
      .update({
        subscription_credits: newSub,
        bonus_credits: newBonus,
      })
      .eq("id", userId);

    if (error) throw error;

    return { success: true, newBalance: newSub + newBonus };
  } catch (error) {
    console.error("Error deducting user credits:", error);
    throw error;
  }
}
