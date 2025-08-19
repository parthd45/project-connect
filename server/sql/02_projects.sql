-- 02_projects.sql
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  skills_needed text[] default '{}',
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  creator_id uuid not null references users(id) on delete cascade
);