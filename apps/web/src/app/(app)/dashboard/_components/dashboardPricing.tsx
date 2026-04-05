"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check, X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useUser } from "@/lib/auth/supabase-client";
import { createCheckoutSession, createBillingPortalSession } from "@/lib/stripe";
import {
  SHADOW_JOURNAL_PRICE_IDS,
  SHADOW_JOURNAL_ONE_TIME,
  getPlanNameByPriceId,
} from "@/lib/stripe-config";
import { useCreditsContext } from "@/providers/Credits";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

/** Dashboard shows monthly subscription pricing only */
const REFLECT_MONTHLY_EUR = 14;
const INITIATE_MONTHLY_EUR = 29;
const INTEGRATOR_MONTHLY_EUR = 59;

function isPaidSubscriptionActive(status: string | null): boolean {
  return status === "active" || status === "trialing";
}

function DashboardPricingContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<
    "reflect" | "initiate" | "extra" | "portal" | null
  >(null);
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
      toast.success("Payment received — your extra analysis credit will appear in a moment.");
      void refreshCredits();
      window.history.replaceState({}, "", "/dashboard/pricing");
    }
  }, [searchParams, refreshCredits]);

  const paidActive = isPaidSubscriptionActive(subscriptionStatus);
  const currentPriceId = subscriptionPriceId?.trim() ?? "";
  const onReflect = paidActive && currentPriceId === reflectId;
  const onInitiate = paidActive && currentPriceId === initiateId;
  const onHigherThanReflect = onInitiate;

  const handleSubscribe = async (priceId: string, key: "reflect" | "initiate") => {
    if (!priceId) {
      toast.error(
        `Add price ID for ${key === "reflect" ? "Reflect" : "Initiate"} in stripe-config.ts`,
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
      setLoading(key);
      const { sessionId } = await createCheckoutSession({
        priceId,
        userId: user.id,
        customerEmail: user.email,
        mode: "subscription",
      });
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) toast.error(error.message ?? "Checkout failed");
    } catch (e) {
      console.error(e);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleBuyExtraAnalysis = async () => {
    if (!extraPriceId) {
      toast.error("Set NEXT_PUBLIC_STRIPE_PRICE_EXTRA_ANALYSIS in .env (one-time price in Stripe).");
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
        userId: user.id,
        customerEmail: user.email,
        mode: "payment",
      });
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) toast.error(error.message ?? "Checkout failed");
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
      toast.error(
        e instanceof Error ? e.message : "Could not open billing portal.",
      );
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl font-sans text-slate-800">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
          Plans
        </p>
        <h1 className="font-headline mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
          Ready to meet yourself?
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Monthly subscriptions for ongoing practice, or buy a single extra analysis
          anytime. Prices shown are billed monthly.
        </p>
        {paidActive && currentPriceId && (
          <div className="border-brand/30 bg-brand/5 mt-5 max-w-2xl rounded-xl border px-4 py-3 text-sm text-slate-700">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>
                <span className="font-semibold text-slate-900">
                  You&apos;re subscribed to {getPlanNameByPriceId(currentPriceId)}.
                </span>{" "}
                The matching plan below is your current plan.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 gap-2 rounded-xl border-brand/40"
                disabled={loading === "portal"}
                onClick={() => void handleManageBilling()}
              >
                <CreditCard className="h-4 w-4" />
                {loading === "portal" ? "Opening…" : "Manage billing"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Start free */}
        <div className="border-dashboard-stroke shadow-card-layered flex flex-col rounded-2xl border bg-white p-5 md:p-6">
          <h3 className="mb-2 font-sans text-lg font-bold text-slate-900">Start free</h3>
          <p className="mb-4 text-sm text-slate-500">Free journaling. No AI analysis.</p>
          <div className="mb-5 text-2xl font-bold text-slate-900">
            €0 <span className="text-sm font-normal text-slate-500">/ forever</span>
          </div>
          <ul className="mb-6 space-y-2.5 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <Check className="text-brand h-4 w-4 shrink-0" />
              Unlimited journaling
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <X className="h-4 w-4 shrink-0" />
              AI analyses
            </li>
          </ul>
          <div className="mt-auto">
            <Link href="/dashboard/journal">
              <Button variant="outline" size="lg" className="w-full rounded-xl">
                Continue journaling
              </Button>
            </Link>
          </div>
        </div>

        {/* Reflect */}
        <div className="border-dashboard-stroke shadow-card-layered relative flex flex-col rounded-2xl border bg-white p-5 transition-shadow hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] md:p-6">
          {onReflect && (
            <div className="absolute top-3 right-3 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold tracking-tighter text-white uppercase">
              Your plan
            </div>
          )}
          <h3 className="mb-2 font-sans text-lg font-bold text-slate-900">Get Reflect</h3>
          <p className="mb-4 text-sm text-slate-500">Journaling plus 10 AI reflections per month.</p>
          <div className="mb-5">
            <span className="text-2xl font-bold text-slate-900">€{REFLECT_MONTHLY_EUR}</span>
            <span className="text-sm font-normal text-slate-500">/ month</span>
          </div>
          <ul className="mb-6 space-y-2.5 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <Check className="text-brand h-4 w-4 shrink-0" />
              Unlimited journaling
            </li>
            <li className="flex items-center gap-2">
              <Check className="text-brand h-4 w-4 shrink-0" />
              10 AI analyses per month
            </li>
          </ul>
          <div className="mt-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-xl border-brand/40 text-brand hover:bg-brand/10 hover:border-brand/60"
              disabled={
                !reflectId ||
                loading === "reflect" ||
                onReflect ||
                onHigherThanReflect
              }
              onClick={() => handleSubscribe(reflectId, "reflect")}
            >
              {onReflect || onHigherThanReflect
                ? onHigherThanReflect
                  ? "Included in your plan"
                  : "Your current plan"
                : loading === "reflect"
                  ? "Redirecting…"
                  : "Subscribe to Reflect"}
            </Button>
          </div>
        </div>

        {/* Initiate */}
        <div className="border-brand/40 shadow-card-layered relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white p-5 md:p-6">
          <div className="bg-brand absolute top-3 right-3 rounded-lg px-2 py-1 text-[10px] font-bold tracking-tighter text-white uppercase">
            {onInitiate ? "Your plan" : "Recommended"}
          </div>
          <h3 className="mb-2 font-sans text-lg font-bold text-slate-900">Get Initiate</h3>
          <p className="mb-4 text-sm text-slate-500">30 AI analyses per month, export & priority support.</p>
          <div className="mb-5">
            <span className="text-2xl font-bold text-slate-900">€{INITIATE_MONTHLY_EUR}</span>
            <span className="text-sm font-normal text-slate-500">/ month</span>
          </div>
          <ul className="mb-6 space-y-2.5 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <Check className="text-brand h-4 w-4 shrink-0" />
              Unlimited journaling
            </li>
            <li className="flex items-center gap-2">
              <Check className="text-brand h-4 w-4 shrink-0" />
              30 AI analyses per month
            </li>
            <li className="flex items-center gap-2">
              <Check className="text-brand h-4 w-4 shrink-0" />
              Export & priority support
            </li>
          </ul>
          <div className="mt-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full rounded-xl bg-brand text-white hover:bg-brand/90"
              disabled={!initiateId || loading === "initiate" || onInitiate}
              onClick={() => handleSubscribe(initiateId, "initiate")}
            >
              {onInitiate
                ? "Your current plan"
                : loading === "initiate"
                  ? "Redirecting…"
                  : paidActive && onReflect
                    ? "Upgrade to Initiate"
                    : "Subscribe to Initiate"}
            </Button>
          </div>
        </div>

        {/* Integrator */}
        <div className="border-dashboard-stroke shadow-card-layered relative flex flex-col rounded-2xl border bg-white/80 p-5 md:p-6">
          <div className="border-amber-500/40 bg-amber-500/10 absolute top-3 right-3 rounded-lg border px-2 py-1 text-[10px] font-bold tracking-tighter text-amber-700 uppercase">
            Coming soon
          </div>
          <h3 className="mb-2 font-sans text-lg font-bold text-slate-900">The Integrator</h3>
          <p className="mb-4 text-sm text-slate-500">Unlimited analyses. Deep work, no limits.</p>
          <div className="mb-5">
            <span className="text-2xl font-bold text-slate-900">€{INTEGRATOR_MONTHLY_EUR}</span>
            <span className="text-sm font-normal text-slate-500">/ month</span>
          </div>
          <ul className="mb-6 space-y-2.5 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-amber-500" />
              Unlimited journaling
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-amber-500" />
              Unlimited AI analyses
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-amber-500" />
              Export & priority support
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-amber-500" />
              Archetype deep-dives
            </li>
          </ul>
          <div className="mt-auto">
            <Button variant="outline" size="lg" className="w-full cursor-not-allowed rounded-xl opacity-60" disabled>
              Coming soon
            </Button>
          </div>
        </div>
      </div>

      {/* One-time add-on — not a subscription */}
      <div className="border-dashboard-stroke shadow-card-layered mt-8 rounded-2xl border bg-white p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              One-time · not recurring
            </p>
            <h3 className="font-headline mt-1 text-xl font-bold text-slate-900">
              Extra AI analysis
            </h3>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Ran out of monthly analyses or want one more deep dive? Buy a single
              credit. Works whether you&apos;re on a plan or on the free tier — credits
              stack with your subscription allowance.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-center ">
            <div className="text-center sm:text-right">
              <p className="text-2xl font-bold text-slate-900">
                €{SHADOW_JOURNAL_ONE_TIME.DISPLAY_PRICE_EUR}
              </p>
              <p className="text-xs text-slate-500">one-time payment</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full rounded-xl bg-brand text-white hover:bg-brand/90 sm:w-auto"
              disabled={!extraPriceId || loading === "extra"}
              onClick={() => void handleBuyExtraAnalysis()}
            >
              {loading === "extra"
                ? "Redirecting…"
                : extraPriceId
                  ? "Buy 1 analysis"
                  : "Configure in .env"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardPricing() {
  return (
    <Elements stripe={stripePromise}>
      <DashboardPricingContent />
    </Elements>
  );
}
