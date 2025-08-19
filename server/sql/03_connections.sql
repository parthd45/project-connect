-- 03_connections.sql (requests + approved connections)
create type connection_status as enum ('pending','approved','denied');

create table if not exists connection_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references users(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  to_user_id uuid not null, -- project owner (redundant for speed)
  message text,
  status connection_status not null default 'pending',
  decision_at timestamptz,
  created_at timestamptz not null default now(),
  unique (from_user_id, project_id) -- one open request per user per project
);

-- approved members
create table if not exists project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text default 'contributor',
  joined_at timestamptz not null default now(),
  unique (project_id, user_id)
);