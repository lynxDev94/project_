// Stripe Configuration
// Real Stripe Price IDs from your account

/** Initiate tier in dashboard (€29). Override with NEXT_PUBLIC_STRIPE_PRICE_INITIATE if needed. */
const INITIATE_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRICE_INITIATE?.trim() ||
  "" ||
  "price_1TEVMpLgnA1V8fpJuBfG4HoZ";

export const STRIPE_PRICE_IDS = {
  // Shadow Journal tiers
  REFLECT: "price_1TECDWLgnA1V8fpJG65bIIGJ",
  INITIATE: INITIATE_PRICE_ID,
  // Legacy / other
  BEGINNER: "price_1TECDWLgnA1V8fpJG65bIIGJ",
  PROFESSIONAL: INITIATE_PRICE_ID,
  ENTERPRISE: "price_1RRlET5RmLx3D9SHeEeJrMEB",
  TEST_PRODUCT: "price_1RRllZ5RmLx3D9SHTTT1pJxc",
} as const;

/** Shadow Journal price IDs for dashboard / checkout */
export const SHADOW_JOURNAL_PRICE_IDS = {
  REFLECT: STRIPE_PRICE_IDS.REFLECT,
  INITIATE: STRIPE_PRICE_IDS.INITIATE,
} as const;

/** Shadow Journal credit limits (1 credit = 1 AI analysis) */
export const SHADOW_JOURNAL_CREDITS = {
  REFLECT: 10,
  INITIATE: 30,
} as const;

/** Extra-analysis top-up (€2 one-time). Override price via NEXT_PUBLIC_STRIPE_PRICE_EXTRA_ANALYSIS. */
const EXTRA_ANALYSIS_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRICE_EXTRA_ANALYSIS?.trim() ||
  "" ||
  "price_1TEzGrLgnA1V8fpJoBa9vZro";

/**
 * One-time purchase: extra AI analyses (not a subscription).
 * Product prod_UDQ7XONd6jWcxg — default price €2.
 */
export const SHADOW_JOURNAL_ONE_TIME = {
  EXTRA_ANALYSIS_PRODUCT_ID: "prod_UDQ7XONd6jWcxg",
  EXTRA_ANALYSIS_PRICE_ID,
  EXTRA_ANALYSIS_CREDITS: 1,
  DISPLAY_PRICE_EUR: 2,
} as const;

/** Webhook + API: allowed one-time checkout kinds */
export const CHECKOUT_KIND_EXTRA_ANALYSIS = "extra_analysis" as const;

export const STRIPE_PRODUCT_IDS = {
  BEGINNER: "prod_UCbQzscxyZDXvK",
  PROFESSIONAL: "prod_UCvDwPU3GtJuJo",
  ENTERPRISE: "prod_SMUCwCBX9XED4d",
  TEST_PRODUCT: "prod_SMUljCmE8mcxv3",
} as const;

// Credit limits for each plan
export const CREDIT_LIMITS = {
  STARTER: 10000,
  PROFESSIONAL: 50000,
  ENTERPRISE: 1000000, // "Unlimited"
  TEST_PRODUCT: 1000,
} as const;

// Plan information for display
export const PLAN_INFO = {
  STARTER: {
    name: "Starter",
    price: 1.29,
    priceId: STRIPE_PRICE_IDS.BEGINNER,
    productId: STRIPE_PRODUCT_IDS.BEGINNER,
    creditLimit: CREDIT_LIMITS.STARTER,
    description: "For small teams exploring AI chatbot capabilities.",
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 2.99,
    priceId: STRIPE_PRICE_IDS.PROFESSIONAL,
    productId: STRIPE_PRODUCT_IDS.PROFESSIONAL,
    creditLimit: CREDIT_LIMITS.PROFESSIONAL,
    description: "Ideal for growing businesses with advanced AI needs.",
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 11.99,
    priceId: STRIPE_PRICE_IDS.ENTERPRISE,
    productId: STRIPE_PRODUCT_IDS.ENTERPRISE,
    creditLimit: CREDIT_LIMITS.ENTERPRISE,
    description:
      "For organizations with complex AI requirements and large teams.",
  },
  TEST_PRODUCT: {
    name: "Test Product",
    price: 0.15,
    priceId: STRIPE_PRICE_IDS.TEST_PRODUCT,
    productId: STRIPE_PRODUCT_IDS.TEST_PRODUCT,
    creditLimit: CREDIT_LIMITS.TEST_PRODUCT,
    description: "Test product for development and testing.",
  },
} as const;

// Shadow Journal plan names by price ID (checked first)
const SHADOW_JOURNAL_PLAN_NAMES: Record<string, string> = {
  [STRIPE_PRICE_IDS.REFLECT]: "Reflect",
  [STRIPE_PRICE_IDS.INITIATE]: "Initiate",
};

// Helper to get plan display name by price ID
export function getPlanNameByPriceId(priceId: string): string {
  if (SHADOW_JOURNAL_PLAN_NAMES[priceId])
    return SHADOW_JOURNAL_PLAN_NAMES[priceId];
  for (const [, info] of Object.entries(PLAN_INFO)) {
    if (info.priceId === priceId) return info.name;
  }
  return "Unknown Plan";
}

// Helper function to get credit limit by price ID
export function getCreditLimitByPriceId(priceId: string): number {
  if (
    priceId === STRIPE_PRICE_IDS.REFLECT ||
    priceId === STRIPE_PRICE_IDS.BEGINNER
  )
    return SHADOW_JOURNAL_CREDITS.REFLECT;
  if (
    priceId === STRIPE_PRICE_IDS.INITIATE ||
    priceId === STRIPE_PRICE_IDS.PROFESSIONAL
  )
    return SHADOW_JOURNAL_CREDITS.INITIATE;
  switch (priceId) {
    case STRIPE_PRICE_IDS.ENTERPRISE:
      return CREDIT_LIMITS.ENTERPRISE;
    case STRIPE_PRICE_IDS.TEST_PRODUCT:
      return CREDIT_LIMITS.TEST_PRODUCT;
    default:
      return 0;
  }
}
