import { useState } from "react";
import { Check, X, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

type BillingPeriod = "monthly" | "quarterly" | "yearly";

const REFLECT_PRICES: Record<
  BillingPeriod,
  { amount: number; label: string; save?: string }
> = {
  monthly: { amount: 14, label: "/ month" },
  quarterly: { amount: 36, label: "/ quarter", save: "Save 14%" },
  yearly: { amount: 140, label: "/ year", save: "2 months free" },
};

const INITIATE_PRICES: Record<
  BillingPeriod,
  { amount: number; label: string; save?: string }
> = {
  monthly: { amount: 29, label: "/ month" },
  quarterly: { amount: 75, label: "/ quarter", save: "Save 14%" },
  yearly: { amount: 290, label: "/ year", save: "2 months free" },
};

const INTEGRATOR_PRICES: Record<
  BillingPeriod,
  { amount: number; label: string; save?: string }
> = {
  monthly: { amount: 59, label: "/ month" },
  quarterly: { amount: 149, label: "/ quarter", save: "Save 16%" },
  yearly: { amount: 590, label: "/ year", save: "2 months free" },
};

export const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="border-brand/30 bg-brand/10 text-brand mb-6 inline-block rounded-full border px-4 py-1 text-xs font-bold">
          LIMITED ALPHA ACCESS
        </div>
        <h2 className="font-headline mb-12 text-4xl font-extralight md:text-6xl">
          Ready to meet yourself?
        </h2>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {(["monthly", "quarterly", "yearly"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setBillingPeriod(period)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                billingPeriod === period
                  ? "bg-brand text-white"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20 md:p-6">
            <h3 className="mb-2 font-sans text-lg font-bold text-slate-100">
              The Seeker
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              Free journaling. No AI analysis.
            </p>
            <div className="mb-5 text-2xl font-bold">
              $0{" "}
              <span className="text-sm font-normal text-slate-500">
                / forever
              </span>
            </div>
            <ul className="mb-6 space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="text-brand h-4 w-4 shrink-0" />
                Unlimited journaling
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <X className="h-4 w-4 shrink-0" />
                AI analyses
              </li>
            </ul>
            <div className="mt-auto">
              <Button
                variant="muted"
                size="lg"
                className="w-full"
              >
                Start Free
              </Button>
            </div>
          </div>
          <div className="hover:border-brand/30 flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors md:p-6">
            <h3 className="mb-2 font-sans text-lg font-bold text-slate-100">
              The Reflect
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              Journaling plus 10 AI reflections per month.
            </p>
            <div className="mb-5">
              <span className="text-2xl font-bold">
                ${REFLECT_PRICES[billingPeriod].amount}
              </span>
              <span className="text-sm font-normal text-slate-500">
                {REFLECT_PRICES[billingPeriod].label}
              </span>
              {REFLECT_PRICES[billingPeriod].save && (
                <span className="text-brand ml-2 text-xs font-medium">
                  {REFLECT_PRICES[billingPeriod].save}
                </span>
              )}
            </div>
            <ul className="mb-6 space-y-2.5 text-sm text-slate-300">
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
              <Link href="/pricing">
                <Button
                  variant="outlineDark"
                  size="lg"
                  className="w-full"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          <div className="group border-brand/40 from-brand/20 to-surface-dark relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-br p-5 md:p-6">
            <div className="bg-brand absolute top-3 right-3 rounded px-2 py-1 text-[10px] font-bold tracking-tighter uppercase">
              Recommended
            </div>
            <h3 className="mb-2 font-sans text-lg font-bold text-slate-100">
              The Initiate
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              30 AI analyses per month, export & priority support.
            </p>
            <div className="mb-5">
              <span className="text-2xl font-bold">
                ${INITIATE_PRICES[billingPeriod].amount}
              </span>
              <span className="text-sm font-normal text-slate-500">
                {INITIATE_PRICES[billingPeriod].label}
              </span>
              {INITIATE_PRICES[billingPeriod].save && (
                <span className="text-brand ml-2 text-xs font-medium">
                  {INITIATE_PRICES[billingPeriod].save}
                </span>
              )}
            </div>
            <ul className="mb-6 space-y-2.5 text-sm text-slate-300">
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
              <Link href="/pricing">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Begin Integration
                </Button>
              </Link>
            </div>
          </div>
          <div className="to-surface-dark relative flex flex-col rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 p-5 opacity-95 md:p-6">
            <div className="absolute top-3 right-3 rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] font-bold tracking-tighter text-amber-300 uppercase">
              Coming soon
            </div>
            <h3 className="mb-2 font-sans text-lg font-bold text-slate-100">
              The Integrator
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              Unlimited analyses. Deep work, no limits.
            </p>
            <div className="mb-5">
              <span className="text-2xl font-bold">
                ${INTEGRATOR_PRICES[billingPeriod].amount}
              </span>
              <span className="text-sm font-normal text-slate-500">
                {INTEGRATOR_PRICES[billingPeriod].label}
              </span>
              {INTEGRATOR_PRICES[billingPeriod].save && (
                <span className="ml-2 text-xs font-medium text-amber-400">
                  {INTEGRATOR_PRICES[billingPeriod].save}
                </span>
              )}
            </div>
            <ul className="mb-6 space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-amber-400" />
                Unlimited journaling
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-amber-400" />
                Unlimited AI analyses
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-amber-400" />
                Export & priority support
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-amber-400" />
                Archetype deep-dives
              </li>
            </ul>
            <div className="mt-auto">
              <Button
                variant="outlineDark"
                size="lg"
                className="w-full cursor-not-allowed border-amber-500/30 text-amber-200/70 hover:border-amber-500/30 hover:bg-transparent"
                disabled
              >
                Coming soon
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
