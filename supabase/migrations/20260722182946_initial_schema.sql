-- Samuh Platform initial schema
-- No auth yet (spec calls this out as a real-build TODO for the worksheet),
-- so RLS policies below are intentionally permissive for the anon role.
-- Tighten these once real auth exists.

create extension if not exists "pgcrypto";

-- Team roster (Discovery step)
create table public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Launched assessment + results feeding the Discovery visual and Awareness charts
create table public.teamq (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'draft' check (status in ('draft', 'launched', 'complete')),
  score numeric,
  capacity_pointer numeric,
  capacity_band text,
  performance_loss_pct numeric,
  performance_loss_label text,
  launched_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Discovery-interview and coaching calendar bookings (Launch step)
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  calendar text not null check (calendar in ('disc', 'coach')),
  date date not null,
  member_id uuid references public.members (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Belonging step media assets
create table public.practices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('video', 'pdf', 'audio')),
  src text,
  meta text,
  created_at timestamptz not null default now()
);

-- Saved 3D object board layouts (Action step)
create table public.arrangements (
  id uuid primary key default gen_random_uuid(),
  name text,
  objects jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Collective worksheet sticky notes (Action step) - realtime enabled below
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  board_id text not null default 'default',
  section text not null,
  x numeric not null default 0,
  y numeric not null default 0,
  text text not null default '',
  author_id uuid references public.members (id) on delete set null,
  author_name text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Awareness bar-chart star votes: one star per member per chart
create table public.awareness_votes (
  id uuid primary key default gen_random_uuid(),
  chart_id text not null check (chart_id in ('environment', 'practices')),
  row_label text not null,
  member_id uuid not null references public.members (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (chart_id, member_id)
);

-- Realtime for the collaborative worksheet
alter publication supabase_realtime add table public.notes;

-- RLS: permissive anon access until real auth lands
alter table public.members enable row level security;
alter table public.teamq enable row level security;
alter table public.bookings enable row level security;
alter table public.practices enable row level security;
alter table public.arrangements enable row level security;
alter table public.notes enable row level security;
alter table public.awareness_votes enable row level security;

create policy "anon full access" on public.members for all using (true) with check (true);
create policy "anon full access" on public.teamq for all using (true) with check (true);
create policy "anon full access" on public.bookings for all using (true) with check (true);
create policy "anon full access" on public.practices for all using (true) with check (true);
create policy "anon full access" on public.arrangements for all using (true) with check (true);
create policy "anon full access" on public.notes for all using (true) with check (true);
create policy "anon full access" on public.awareness_votes for all using (true) with check (true);
