-- LLM usage ledger for cost and token tracking
create table if not exists public.llm_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_id uuid null references public.entries(id) on delete set null,
  source text not null check (source in ('analysis')),
  model text not null,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  total_tokens integer not null default 0 check (total_tokens >= 0),
  estimated_cost_usd numeric(12, 8) not null default 0 check (estimated_cost_usd >= 0),
  created_at timestamptz not null default now()
);

alter table public.llm_usage_events enable row level security;

drop policy if exists "Users can read own usage events" on public.llm_usage_events;
create policy "Users can read own usage events"
on public.llm_usage_events
for select
using (auth.uid() = user_id);

drop policy if exists "Service role can insert usage events" on public.llm_usage_events;
create policy "Service role can insert usage events"
on public.llm_usage_events
for insert
to service_role
with check (true);

create index if not exists llm_usage_events_user_created_idx
  on public.llm_usage_events (user_id, created_at desc);

create index if not exists llm_usage_events_entry_idx
  on public.llm_usage_events (entry_id);
