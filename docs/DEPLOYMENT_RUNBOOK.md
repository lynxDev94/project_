# Deployment Runbook

## 1) Environment matrix

Set these on your hosting provider for `apps/web`:

- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `LANGGRAPH_API_URL`
- `LANGGRAPH_ASSISTANT_ID` (optional, default: `agent`)

Optional controls:
- `OPENAI_MODEL` (default: `gpt-4o-mini`)
- `AI_MONTHLY_TOKEN_LIMIT` (default: `250000`)
- `AI_MONTHLY_COST_LIMIT_USD` (default: `20`)

## 2) Supabase migration order

1. Base app schema (users, mood entries, journal entries, stripe event table, RLS)
2. `supabase-llm-usage-migration.sql`

Validate after migration:
- `llm_usage_events` table exists
- RLS is enabled on `llm_usage_events`
- Read policy for owners and insert policy for `service_role` exist

## 3) Stripe configuration

Create webhook endpoint:
- URL: `https://YOUR_DOMAIN/api/webhooks/stripe`
- Events:
  - `checkout.session.completed`
  - `invoice.paid`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

Set `STRIPE_WEBHOOK_SECRET` from Stripe dashboard.

## 4) Security checks before go-live

- Verify `/api/user/credits` returns data only for authenticated user
- Verify `/api/create-checkout-session` ignores client user IDs and enforces allowed price IDs
- Verify `/api/auth/callback` only redirects to relative paths
- Verify middleware blocks unauthorized `/dashboard/*` and protected `/api/*`
- Verify analysis route rate limiting and monthly limit messaging

## 5) Smoke test checklist

1. Sign up and sign in
2. Create/edit/delete journal entry
3. Submit mood and view dashboard trend
4. Buy subscription in Stripe test mode
5. Confirm credits update in UI
6. Run one AI analysis and confirm:
   - credits deducted by 1
   - usage row created in `llm_usage_events`
7. Trigger analysis failure and verify refund behavior

## 6) Rollback plan

If deployment breaks:

1. Roll back app deployment to previous stable release
2. Keep DB migration in place (safe additive table)
3. Temporarily disable analysis CTA in UI if OpenAI key/quota or LangGraph backend issues occur
4. Keep Stripe webhook active; verify no duplicate processing
