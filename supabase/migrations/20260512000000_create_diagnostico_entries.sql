create extension if not exists pgcrypto;

create table if not exists public.diagnostico_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ip_hash text,
  outcome text not null check (
    outcome in ('out_icp', 'out_invest_low', 'out_nutricao', 'final_qualified')
  ),
  nome text not null,
  empresa text not null,
  instagram text,
  whatsapp text not null,
  cidade text not null,
  segmento text not null,
  servico text,
  gargalo text,
  canais text[] not null default '{}',
  follow text,
  investe text,
  frente text,
  investimento text,
  intent text,
  timing text,
  answers jsonb not null,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.diagnostico_entries enable row level security;

create index if not exists diagnostico_entries_created_at_idx
  on public.diagnostico_entries (created_at desc);

create index if not exists diagnostico_entries_ip_hash_created_at_idx
  on public.diagnostico_entries (ip_hash, created_at desc);

create index if not exists diagnostico_entries_outcome_idx
  on public.diagnostico_entries (outcome);

create index if not exists diagnostico_entries_empresa_idx
  on public.diagnostico_entries (empresa);
