alter table public.diagnostico_entries
  add column if not exists ip_hash text;

create index if not exists diagnostico_entries_ip_hash_created_at_idx
  on public.diagnostico_entries (ip_hash, created_at desc);
