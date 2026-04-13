import { Suspense } from "react";
import { PricingPageClient } from "./_components/pricingPageClient";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardPricingPage() {
  return (
    <>
      <Toaster />
      <Suspense
        fallback={
          <div className="text-sm text-slate-500">Loading pricing…</div>
        }
      >
        <PricingPageClient />
      </Suspense>
    </>
  );
}
