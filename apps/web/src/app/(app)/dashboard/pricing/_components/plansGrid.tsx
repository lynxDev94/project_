import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FREE_PLAN,
  INITIATE_PLAN,
  INTEGRATOR_PLAN,
  REFLECT_PLAN,
} from "../_lib/planCatalog";
import {
  initiateSubscribeButtonLabel,
  reflectSubscribeButtonLabel,
} from "../_lib/planCtaLabels";
import type { PlansGridProps } from "../_lib/types";
import { planConfigFromCatalog } from "./planConfigFromCatalog";
import { PlanCard } from "./planCard";

export function PlansGrid({
  reflectId,
  initiateId,
  loading,
  onReflect,
  onInitiate,
  onHigherThanReflect,
  paidActive,
  onSubscribe,
}: PlansGridProps) {
  const reflectButtonLabel = reflectSubscribeButtonLabel({
    isReflectPlan: onReflect,
    isSubscribedToHigherTier: onHigherThanReflect,
    loading,
  });

  const initiateButtonLabel = initiateSubscribeButtonLabel({
    isInitiatePlan: onInitiate,
    loading,
    isUpgradeFromReflect: paidActive && onReflect,
  });

  const freePlan = planConfigFromCatalog(FREE_PLAN, {
    cta: (
      <Link href="/dashboard/journal">
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-xl"
        >
          Continue journaling
        </Button>
      </Link>
    ),
  });

  const reflectPlan = planConfigFromCatalog(REFLECT_PLAN, {
    badge: onReflect ? { label: "Your plan", tone: "success" } : undefined,
    cta: (
      <Button
        variant="outline"
        size="lg"
        className="border-brand/40 text-brand hover:bg-brand/10 hover:border-brand/60 w-full rounded-xl"
        disabled={
          !reflectId ||
          loading === "reflect" ||
          onReflect ||
          onHigherThanReflect
        }
        onClick={() => onSubscribe(reflectId, "reflect")}
      >
        {reflectButtonLabel}
      </Button>
    ),
  });

  const initiatePlan = planConfigFromCatalog(INITIATE_PLAN, {
    badge: {
      label: onInitiate ? "Your plan" : "Recommended",
      tone: "brand",
    },
    cta: (
      <Button
        variant="primary"
        size="lg"
        className="bg-brand hover:bg-brand/90 w-full rounded-xl text-white"
        disabled={!initiateId || loading === "initiate" || onInitiate}
        onClick={() => onSubscribe(initiateId, "initiate")}
      >
        {initiateButtonLabel}
      </Button>
    ),
  });

  const integratorPlan = planConfigFromCatalog(INTEGRATOR_PLAN, {
    cta: (
      <Button
        variant="outline"
        size="lg"
        className="w-full cursor-not-allowed rounded-xl opacity-60"
        disabled
      >
        Coming soon
      </Button>
    ),
  });

  const plans = [freePlan, reflectPlan, initiatePlan, integratorPlan];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
        />
      ))}
    </div>
  );
}
