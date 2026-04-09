import { describe, expect, it } from "vitest";
import { applyRateLimit } from "@/lib/rate-limit";

describe("applyRateLimit", () => {
  it("allows requests up to max in a window", () => {
    const key = `test-allow-${Date.now()}`;
    const first = applyRateLimit({ key, windowMs: 10_000, maxRequests: 2 });
    const second = applyRateLimit({ key, windowMs: 10_000, maxRequests: 2 });
    const third = applyRateLimit({ key, windowMs: 10_000, maxRequests: 2 });

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(third.ok).toBe(false);
  });

  it("resets after the window expires", async () => {
    const key = `test-reset-${Date.now()}`;
    const one = applyRateLimit({ key, windowMs: 20, maxRequests: 1 });
    const blocked = applyRateLimit({ key, windowMs: 20, maxRequests: 1 });
    await new Promise((resolve) => setTimeout(resolve, 30));
    const afterReset = applyRateLimit({ key, windowMs: 20, maxRequests: 1 });

    expect(one.ok).toBe(true);
    expect(blocked.ok).toBe(false);
    expect(afterReset.ok).toBe(true);
  });
});
