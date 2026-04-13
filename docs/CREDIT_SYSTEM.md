# Credit and AI Usage System

## Overview

The app uses two protection layers for AI operations:

1. **Credit gating** (business limit): 1 analysis = 1 credit
2. **Monthly usage limits** (cost safety): token and estimated USD caps

## Source of truth

- Credits are stored as:
  - `users.subscription_credits`
  - `users.bonus_credits`
- Displayed balance = `subscription_credits + bonus_credits`

## Server enforcement flow

For `POST /api/entries/[id]/analysis`:

1. Authenticate user
2. Apply per-user + per-IP rate limits
3. Check monthly usage caps (`AI_MONTHLY_TOKEN_LIMIT`, `AI_MONTHLY_COST_LIMIT_USD`)
4. Deduct 1 credit atomically-ish (optimistic concurrency retry)
5. Run LangGraph analysis (agents backend with your tool/RAG setup)
6. Validate response shape
7. Record usage event in `llm_usage_events`
8. Refund credit on failure paths

## Usage ledger

`llm_usage_events` stores:
- `user_id`
- `entry_id`
- `source`
- `model`
- `input_tokens`
- `output_tokens`
- `total_tokens`
- `estimated_cost_usd`
- `created_at`

Migration file: `supabase-llm-usage-migration.sql`

## Relevant files

- `apps/web/src/lib/credits-server.ts`
- `apps/web/src/app/api/entries/[id]/analysis/route.ts`
- `apps/web/src/providers/Credits.tsx`
- `apps/web/src/app/api/user/credits/route.ts`

## Notes

- Client-side checks are UX only.
- Real enforcement is server-side.
- Current cost calculation is approximate per model rates and should be tuned to your actual provider pricing.
