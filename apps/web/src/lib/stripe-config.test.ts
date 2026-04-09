import { describe, expect, it } from "vitest";
import {
  SHADOW_JOURNAL_CREDITS,
  SHADOW_JOURNAL_PRICE_IDS,
  getCreditLimitByPriceId,
  getPlanNameByPriceId,
} from "@/lib/stripe-config";

describe("stripe-config helpers", () => {
  it("returns shadow journal plan names for known price ids", () => {
    expect(getPlanNameByPriceId(SHADOW_JOURNAL_PRICE_IDS.REFLECT)).toBe(
      "Reflect",
    );
    expect(getPlanNameByPriceId(SHADOW_JOURNAL_PRICE_IDS.INITIATE)).toBe(
      "Initiate",
    );
  });

  it("returns expected credit limits for active plans", () => {
    expect(getCreditLimitByPriceId(SHADOW_JOURNAL_PRICE_IDS.REFLECT)).toBe(
      SHADOW_JOURNAL_CREDITS.REFLECT,
    );
    expect(getCreditLimitByPriceId(SHADOW_JOURNAL_PRICE_IDS.INITIATE)).toBe(
      SHADOW_JOURNAL_CREDITS.INITIATE,
    );
  });
});
