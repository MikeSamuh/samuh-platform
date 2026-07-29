-- Auth + multi-team model.
--
-- Roles:
--   manager     — creates the team, adds the roster, runs the journey
--   member      — participates in their team's journey
--   samuh_admin — Samuh staff; sees progress across every client team
--
-- Step progress is shared across a team (the team moves together).
-- The initial schema's tables were never written to, so they are replaced.

drop table if exists public.awareness_votes cascade;
drop table if exists public.notes cascade;
drop table if exists public.arrangements cascade;
drop table if exists public.practices cascade;
drop table if exists public.bookings cascade;
drop table if exists public.teamq cascade;
drop table if exists public.members cascade;

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- One row per authenticated user.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'member' check (role in ('member', 'manager', 'samuh_admin')),
  team_id uuid references public.teams (id) on delete set null,
  created_at timestamptz not null default now()
);

-- The roster a manager builds on Prepare. Rows may exist before the person
-- signs up; user_id links them once they do (matched on email).
create table public.members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  name text not null,
  email text,
  tenure text,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index members_team_idx on public.members (team_id);
create index members_email_idx on public.members (lower(email));

-- Singleton per team: co-lead, ritual keeper, launch state.
create table public.team_state (
  team_id uuid primary key references public.teams (id) on delete cascade,
  co_lead_member_id uuid references public.members (id) on delete set null,
  ritual_keeper_member_id uuid references public.members (id) on delete set null,
  launched boolean not null default false,
  launched_at timestamptz
);

-- Shared step task completion.
create table public.step_progress (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  step_id text not null,
  task_id text not null,
  completed_at timestamptz not null default now(),
  unique (team_id, step_id, task_id)
);

-- Launched assessment + scores feeding the Awareness visual.
create table public.teamq (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
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

-- One metaphor card per member.
create table public.card_picks (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  member_id uuid not null references public.members (id) on delete cascade,
  card_id text not null,
  description text,
  updated_at timestamptz not null default now(),
  unique (team_id, member_id)
);

-- One star per member per chart.
create table public.awareness_votes (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  member_id uuid not null references public.members (id) on delete cascade,
  chart_id text not null check (chart_id in ('environment', 'practices')),
  row_label text not null,
  unique (team_id, chart_id, member_id)
);

-- Displayed anonymously in the app; member_id is kept only so the admin
-- dashboard can report participation.
create table public.reflections (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  member_id uuid references public.members (id) on delete set null,
  text text not null,
  created_at timestamptz not null default now()
);

-- Collective worksheet (ritual canvas) notes.
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  section text not null,
  x numeric not null default 12,
  y numeric not null default 12,
  text text not null default '',
  member_id uuid references public.members (id) on delete set null,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notes_team_idx on public.notes (team_id);

alter publication supabase_realtime add table public.notes;

-- Helpers. security definer so they can read profiles without tripping the
-- policies defined on profiles itself.
create or replace function public.current_team_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select team_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_samuh_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role = 'samuh_admin' from public.profiles where id = auth.uid()), false);
$$;

-- On signup: create a profile. If the email is already on a team's roster,
-- join that team as a member and link the roster row; otherwise the person is
-- a manager with no team yet (the UI prompts them to name one).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  roster_row public.members%rowtype;
begin
  select * into roster_row
  from public.members
  where lower(email) = lower(new.email)
    and user_id is null
  limit 1;

  if roster_row.id is not null then
    insert into public.profiles (id, email, full_name, role, team_id)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data ->> 'full_name', roster_row.name),
      'member',
      roster_row.team_id
    );
    update public.members set user_id = new.id where id = roster_row.id;
  else
    insert into public.profiles (id, email, full_name, role, team_id)
    values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', 'manager', null);
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.teams enable row level security;
alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.team_state enable row level security;
alter table public.step_progress enable row level security;
alter table public.teamq enable row level security;
alter table public.card_picks enable row level security;
alter table public.awareness_votes enable row level security;
alter table public.reflections enable row level security;
alter table public.notes enable row level security;

-- teams
create policy "read own team or admin" on public.teams
  for select using (id = public.current_team_id() or public.is_samuh_admin());
create policy "signed-in users can create a team" on public.teams
  for insert with check (auth.uid() is not null);
create policy "team members can update their team" on public.teams
  for update using (id = public.current_team_id());

-- profiles
create policy "read self, teammates, or admin" on public.profiles
  for select using (
    id = auth.uid()
    or (team_id is not null and team_id = public.current_team_id())
    or public.is_samuh_admin()
  );
create policy "update own profile" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Team-scoped tables: members read/write their own team; Samuh admins read all.
do $$
declare
  t text;
begin
  foreach t in array array[
    'members', 'team_state', 'step_progress', 'teamq',
    'card_picks', 'awareness_votes', 'reflections', 'notes'
  ]
  loop
    execute format(
      'create policy "team read" on public.%I for select using (team_id = public.current_team_id() or public.is_samuh_admin())', t
    );
    execute format(
      'create policy "team insert" on public.%I for insert with check (team_id = public.current_team_id())', t
    );
    execute format(
      'create policy "team update" on public.%I for update using (team_id = public.current_team_id()) with check (team_id = public.current_team_id())', t
    );
    execute format(
      'create policy "team delete" on public.%I for delete using (team_id = public.current_team_id())', t
    );
  end loop;
end $$;
