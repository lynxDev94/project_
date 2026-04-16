# Shadow Journal

Portfolio-grade journaling app built with Next.js, Supabase, Stripe, LangGraph agents, and server-side AI analysis.

## What this app includes

- Auth (email + optional Google OAuth) via Supabase
- Mood trend check-in and dashboard stats
- Journal entries CRUD + search
- Stripe subscription + one-time extra analysis purchase
- Server-side AI analysis endpoint (via `apps/agents`) with credit deduction, refund-on-failure, rate limits, and usage ledger tracking
- SEO + PWA baseline (manifest, robots, sitemap, service worker)

## Project structure

- `apps/web` - Main Next.js app (App Router)
- `docs` - Setup, architecture, deployment notes
- `supabase-llm-usage-migration.sql` - Migration for token/cost usage ledger

## Quick start

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm web:dev
```

## Required environment variables

Set in `apps/web/.env.local`:

- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `LANGGRAPH_API_URL` (for analysis orchestration)

Optional limits:

- `OPENAI_MODEL` (default `gpt-4o-mini`)
- `AI_MONTHLY_TOKEN_LIMIT` (default `250000`)
- `AI_MONTHLY_COST_LIMIT_USD` (default `20`)

## Database setup

Run your base schema first (users, entries, mood entries, stripe event tables), then run:

```sql
-- Supabase SQL editor
-- file: supabase-llm-usage-migration.sql
```

This creates `llm_usage_events` to track per-user token and cost usage.

## Stripe local webhook

```bash
stripe listen \
  --events checkout.session.completed,invoice.paid,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted \
  --forward-to localhost:3000/api/webhooks/stripe
```

## Quality gates

```bash
pnpm lint
pnpm test
pnpm build
```

CI runs format, lint, spelling, test, dev startup check, and build.

## Deployment

See [docs/DEPLOYMENT_RUNBOOK.md](docs/DEPLOYMENT_RUNBOOK.md) for:

- env matrix
- migration order
- Stripe webhook setup
- smoke-test checklist
- rollback steps
