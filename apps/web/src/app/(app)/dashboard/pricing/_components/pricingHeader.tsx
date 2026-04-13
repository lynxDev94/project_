import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

type PricingHeaderProps = {
  paidActive: boolean;
  currentPlanName: string | null;
  isPortalLoading: boolean;
  onManageBilling: () => void;
};

export function PricingHeader({
  paidActive,
  currentPlanName,
  isPortalLoading,
  onManageBilling,
}: PricingHeaderProps) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
        Plans
      </p>
      <h1 className="font-headline mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
        Ready to meet yourself?
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Monthly subscriptions for ongoing practice, or buy a single extra
        analysis anytime. Prices shown are billed monthly.
      </p>

      {paidActive && currentPlanName && (
        <div className="border-brand/30 bg-brand/5 mt-5 max-w-2xl rounded-xl border px-4 py-3 text-sm text-slate-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold text-slate-900">
                You&apos;re subscribed to {currentPlanName}.
              </span>{" "}
              The matching plan below is your current plan.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-brand/40 shrink-0 gap-2 rounded-xl"
              disabled={isPortalLoading}
              onClick={onManageBilling}
            >
              <CreditCard className="h-4 w-4" />
              {isPortalLoading ? "Opening…" : "Manage billing"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
