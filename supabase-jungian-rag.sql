-- =====================================================
-- Jungian Knowledge Base (RAG) Schema
-- =====================================================
-- Run this in Supabase SQL Editor after supabase-schema.sql.
-- Requires pgvector extension.
-- =====================================================

create extension if not exists vector;

create table if not exists public.jungian_documents (
  id uuid primary key default gen_random_uuid(),
  source text not null unique,
  source_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jungian_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.jungian_documents(id) on delete cascade,
  source text not null,
  chunk_index integer not null,
  content text not null,
  source_hash text not null,
  embedding vector(1536) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_hash, chunk_index)
);

create index if not exists idx_jungian_docs_source on public.jungian_documents(source);
create index if not exists idx_jungian_chunks_source on public.jungian_chunks(source);
create index if not exists idx_jungian_chunks_hash on public.jungian_chunks(source_hash);

create index if not exists idx_jungian_chunks_embedding
on public.jungian_chunks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create or replace function update_jungian_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_jungian_documents_updated_at on public.jungian_documents;
create trigger update_jungian_documents_updated_at
before update on public.jungian_documents
for each row execute function update_jungian_updated_at();

drop trigger if exists update_jungian_chunks_updated_at on public.jungian_chunks;
create trigger update_jungian_chunks_updated_at
before update on public.jungian_chunks
for each row execute function update_jungian_updated_at();

alter table public.jungian_documents enable row level security;
alter table public.jungian_chunks enable row level security;

drop policy if exists "Public read jungian docs" on public.jungian_documents;
create policy "Public read jungian docs" on public.jungian_documents
for select using (true);

drop policy if exists "Public read jungian chunks" on public.jungian_chunks;
create policy "Public read jungian chunks" on public.jungian_chunks
for select using (true);

drop policy if exists "Service role manage jungian docs" on public.jungian_documents;
create policy "Service role manage jungian docs" on public.jungian_documents
for all using ((auth.jwt() ->> 'role') = 'service_role')
with check ((auth.jwt() ->> 'role') = 'service_role');

drop policy if exists "Service role manage jungian chunks" on public.jungian_chunks;
create policy "Service role manage jungian chunks" on public.jungian_chunks
for all using ((auth.jwt() ->> 'role') = 'service_role')
with check ((auth.jwt() ->> 'role') = 'service_role');

create or replace function public.match_jungian_chunks(
  query_embedding vector(1536),
  match_count integer default 4
)
returns table (
  id uuid,
  source text,
  chunk_index integer,
  content text,
  source_hash text,
  similarity float
)
language sql
stable
as $$
  select
    c.id,
    c.source,
    c.chunk_index,
    c.content,
    c.source_hash,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.jungian_chunks c
  order by c.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;
