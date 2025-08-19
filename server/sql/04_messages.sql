-- 04_messages.sql (unlocked when connection approved)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  from_user_id uuid not null references users(id) on delete cascade,
  to_user_id uuid not null references users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- indexes for search/filter
create index if not exists idx_users_skills on users using gin (skills);
create index if not exists idx_projects_skills_needed on projects using gin (skills_needed);
create index if not exists idx_projects_created on projects (created_at desc);