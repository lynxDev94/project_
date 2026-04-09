"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useUser } from "@/lib/auth/supabase-client";
import {
  createBillingPortalSession,
  createCheckoutSession,
} from "@/lib/stripe";
import {
  SHADOW_JOURNAL_ONE_TIME,
  SHADOW_JOURNAL_PRICE_IDS,
  getPlanNameByPriceId,
} from "@/lib/stripe-config";
import { useCreditsContext } from "@/providers/Credits";
import { ExtraAnalysisCard } from "./extraAnalysisCard";
import { PlansGrid } from "./plansGrid";
import { PricingHeader } from "./pricingHeader";
import type { LoadingState, SubscriptionTier } from "../_lib/types";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

function isPaidSubscriptionActive(status: string | null): boolean {
  return status === "active" || status === "trialing";
}

function PricingPageContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<LoadingState>(null);
  const { user } = useUser();
  const stripe = useStripe();
  const { refreshCredits, subscriptionPriceId, subscriptionStatus } =
    useCreditsContext();

  const reflectId = SHADOW_JOURNAL_PRICE_IDS.REFLECT.trim();
  const initiateId = SHADOW_JOURNAL_PRICE_IDS.INITIATE.trim();
  const extraPriceId = SHADOW_JOURNAL_ONE_TIME.EXTRA_ANALYSIS_PRICE_ID.trim();

  useEffect(() => {
    void refreshCredits();
  }, [refreshCredits]);

  useEffect(() => {
    if (searchParams.get("extra_analysis") === "success") {
      toast.success(
        "Payment received — your extra analysis credit will appear in a moment.",
      );
      void refreshCredits();
      window.history.replaceState({}, "", "/dashboard/pricing");
    }
  }, [searchParams, refreshCredits]);

  const paidActive = isPaidSubscriptionActive(subscriptionStatus);
  const currentPriceId = subscriptionPriceId?.trim() ?? "";
  const onReflect = paidActive && currentPriceId === reflectId;
  const onInitiate = paidActive && currentPriceId === initiateId;
  const onHigherThanReflect = onInitiate;

  const handleSubscribe = async (priceId: string, tier: SubscriptionTier) => {
    if (!priceId) {
      toast.error(
        `Add price ID for ${tier === "reflect" ? "Reflect" : "Initiate"} in stripe-config.ts`,
      );
      return;
    }
    if (!user?.id || !user?.email) {
      toast.error("Please sign in to subscribe.");
      return;
    }
    if (!stripe) {
      toast.error("Stripe is still loading. Try again in a moment.");
      return;
    }

    try {
      setLoading(tier);
      const { sessionId } = await createCheckoutSession({
        priceId,
        mode: "subscription",
      });
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) toast.error(error.message ?? "Checkout failed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleBuyExtraAnalysis = async () => {
    if (!extraPriceId) {
      toast.error(
        "Set NEXT_PUBLIC_STRIPE_PRICE_EXTRA_ANALYSIS in .env (one-time price in Stripe).",
      );
      return;
    }
    if (!user?.id || !user?.email) {
      toast.error("Please sign in to purchase.");
      return;
    }
    if (!stripe) {
      toast.error("Stripe is still loading. Try again in a moment.");
      return;
    }

    try {
      setLoading("extra");
      const { sessionId } = await createCheckoutSession({
        priceId: extraPriceId,
        mode: "payment",
      });
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) toast.error(error.message ?? "Checkout failed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      setLoading("portal");
      const { url } = await createBillingPortalSession();
      window.location.href = url;
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not open billing portal.",
      );
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl font-sans text-slate-800">
      <PricingHeader
        paidActive={paidActive}
        currentPlanName={
          currentPriceId ? getPlanNameByPriceId(currentPriceId) : null
        }
        isPortalLoading={loading === "portal"}
        onManageBilling={() => void handleManageBilling()}
      />

      <PlansGrid
        reflectId={reflectId}
        initiateId={initiateId}
        loading={loading}
        onReflect={onReflect}
        onInitiate={onInitiate}
        onHigherThanReflect={onHigherThanReflect}
        paidActive={paidActive}
        onSubscribe={(priceId, tier) => {
          void handleSubscribe(priceId, tier);
        }}
      />

      <ExtraAnalysisCard
        displayPriceEur={SHADOW_JOURNAL_ONE_TIME.DISPLAY_PRICE_EUR}
        extraPriceId={extraPriceId}
        isLoading={loading === "extra"}
        onBuy={() => {
          void handleBuyExtraAnalysis();
        }}
      />
    </div>
  );
}

export function PricingPageClient() {
  return (
    <Elements stripe={stripePromise}>
      <PricingPageContent />
    </Elements>
  );
}
