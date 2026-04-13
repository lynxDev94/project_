# Supabase Setup

This project uses Supabase for auth + data storage.

## 1) Required tables

Your base schema should include:
- `users`
- `entries`
- `mood_entries`
- `stripe_subscription_credit_events`

`users` should use:
- `subscription_credits`
- `bonus_credits`
- `subscription_status`
- `price_id`
- `stripe_customer_id`
- `stripe_subscription_id`

## 2) Apply usage ledger migration

Run this file in Supabase SQL Editor:

- `supabase-llm-usage-migration.sql`

It creates:
- `llm_usage_events`
- RLS policies for reading own usage
- service-role insert policy
- indexes for reporting

## 3) RLS expectations

- User-scoped tables (`entries`, `mood_entries`, `llm_usage_events`) should enforce `auth.uid() = user_id`.
- Service role is used in server routes for webhook/usage writes.

## 4) Verify after setup

Run:

```sql
select count(*) from public.users;
select count(*) from public.entries;
select count(*) from public.mood_entries;
select count(*) from public.llm_usage_events;
```

## 5) Common mistakes

- Using `credits_available` instead of `subscription_credits + bonus_credits`
- Forgetting `SUPABASE_SERVICE_ROLE_KEY` in production env
- Missing Stripe webhook secret