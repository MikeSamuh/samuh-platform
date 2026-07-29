-- A manager creating a team could insert the row but not read it back: the
-- select policy only matched teams they already belonged to, and their profile
-- isn't pointed at the new team until the insert returns. Track the creator so
-- they can read their own team immediately.

alter table public.teams
  add column if not exists created_by uuid references auth.users (id) on delete set null;

alter table public.teams
  alter column created_by set default auth.uid();

drop policy if exists "read own team or admin" on public.teams;
create policy "read own team, created, or admin" on public.teams
  for select using (
    id = public.current_team_id()
    or created_by = auth.uid()
    or public.is_samuh_admin()
  );

drop policy if exists "team members can update their team" on public.teams;
create policy "team members can update their team" on public.teams
  for update using (id = public.current_team_id() or created_by = auth.uid());
