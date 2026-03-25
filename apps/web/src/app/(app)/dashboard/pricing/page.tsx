import { Suspense } from "react";
import { DashboardPricing } from "../_components/DashboardPricing";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardPricingPage() {
  return (
    <>
      <Toaster />
      <Suspense fallback={<div className="text-slate-500 text-sm">Loading pricing…</div>}>
        <DashboardPricing />
      </Suspense>
    </>
  );
}