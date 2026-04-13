import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const REFLECT_MONTHLY_EUR = 14;
const INITIATE_MONTHLY_EUR = 29;
const INTEGRATOR_MONTHLY_EUR = 59;

export const Pricing = () => {
  return (
    <section
      id="pricing"
      className="py-24"
    >
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="border-brand/30 bg-brand/10 text-brand mb-6 inline-block rounded-full border px-4 py-1 text-xs font-semibold tracking-wider uppercase">
          Monthly Plans
        </div>
        <h2 className="font-headline mb-3 text-4xl font-extralight md:text-6xl">
          Ready to meet yourself?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-sm text-slate-400">
          Start free, then upgrade when you want deeper reflection. 1 credit = 1
          AI analysis.
        </p>

        <div className="grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20 md:p-6">
            <h3 className="mb-2 font-sans text-lg font-bold text-slate-100">
              Start free
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              Free journaling. No AI analysis.
            </p>
            <div className="mb-5 text-2xl font-bold">
              {"\u20AC"}0{" "}
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
              <Link href="/signup">
                <Button
                  variant="muted"
                  size="lg"
                  className="w-full rounded-xl"
                >
                  Start Free
                </Button>
              </Link>
            </div>
          </div>

          <div className="hover:border-brand/30 flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors md:p-6">
            <h3 className="mb-2 font-sans text-lg font-bold text-slate-100">
              Get Reflect
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              Journaling plus 10 AI reflections per month.
            </p>
            <div className="mb-5">
              <span className="text-2xl font-bold">
                {"\u20AC"}
                {REFLECT_MONTHLY_EUR}
              </span>
              <span className="text-sm font-normal text-slate-500">
                / month
              </span>
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
              <Link href="/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-brand/40 text-brand hover:border-brand/60 hover:bg-brand/10 hover:text-brand w-full rounded-xl bg-transparent"
                >
                  Choose Reflect
                </Button>
              </Link>
            </div>
          </div>

          <div className="group border-brand/40 from-brand/20 to-surface-dark relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-br p-5 md:p-6">
            <div className="bg-brand absolute top-3 right-3 rounded px-2 py-1 text-[10px] font-bold tracking-tighter uppercase">
              Recommended
            </div>
            <h3 className="mb-2 font-sans text-lg font-bold text-slate-100">
              Get Initiate
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              30 AI analyses per month, export & priority support.
            </p>
            <div className="mb-5">
              <span className="text-2xl font-bold">
                {"\u20AC"}
                {INITIATE_MONTHLY_EUR}
              </span>
              <span className="text-sm font-normal text-slate-500">
                / month
              </span>
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
              <Link href="/signup">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-brand hover:bg-brand/90 w-full rounded-xl text-white"
                >
                  Choose Initiate
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
                {"\u20AC"}
                {INTEGRATOR_MONTHLY_EUR}
              </span>
              <span className="text-sm font-normal text-slate-500">
                / month
              </span>
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
