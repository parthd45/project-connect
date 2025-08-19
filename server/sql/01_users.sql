-- 01_users.sql
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  password_hash text,
  github_username text,
  github_link text,
  avatar_url text,
  bio text,
  skills text[] default '{}',
  interests text[] default '{}',
  created_at timestamptz not null default now(),
  constraint email_or_github check (email is not null or github_username is not null)
);