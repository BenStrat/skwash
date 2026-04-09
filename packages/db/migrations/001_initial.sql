create extension if not exists pgcrypto;

create type public.user_role as enum ('owner', 'admin', 'member', 'viewer');
create type public.project_status as enum ('active', 'archived');
create type public.review_status as enum ('none', 'in_progress', 'ready_for_review', 'approved', 'changes_requested');
create type public.annotation_type as enum ('pin', 'area');
create type public.annotation_status as enum ('active', 'resolved');
create type public.review_session_status as enum ('in_progress', 'complete');
create type public.cluster_severity as enum ('critical', 'high', 'medium', 'low');

create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references public.organisations(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  role public.user_role not null default 'owner',
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(id) on delete cascade,
  name text not null,
  base_url text not null,
  status public.project_status not null default 'active',
  review_status public.review_status not null default 'none',
  linear_team_id text,
  linear_api_key_encrypted text,
  graphql_endpoint text,
  graphql_headers_encrypted jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.review_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.review_rounds (
  id uuid primary key default gen_random_uuid(),
  review_item_id uuid not null references public.review_items(id) on delete cascade,
  label text not null,
  description text,
  is_active boolean not null default true,
  created_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.annotations (
  id uuid primary key default gen_random_uuid(),
  review_item_id uuid not null references public.review_items(id) on delete cascade,
  review_round_id uuid references public.review_rounds(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  type public.annotation_type not null,
  viewport text not null,
  pin_number integer not null,
  x_percent double precision not null,
  y_percent double precision not null,
  width_percent double precision,
  height_percent double precision,
  status public.annotation_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  annotation_id uuid not null references public.annotations(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null,
  edited_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (comment_id, user_id, emoji)
);

create table public.review_sessions (
  id uuid primary key default gen_random_uuid(),
  review_item_id uuid not null references public.review_items(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  status public.review_session_status not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.feedback_clusters (
  id uuid primary key default gen_random_uuid(),
  review_item_id uuid not null references public.review_items(id) on delete cascade,
  title text not null,
  summary text not null,
  severity public.cluster_severity not null,
  tags text[] not null default '{}',
  annotation_ids uuid[] not null,
  linear_issue_id text,
  linear_issue_url text,
  exported boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.reviewer_notes (
  id uuid primary key default gen_random_uuid(),
  review_item_id uuid not null unique references public.review_items(id) on delete cascade,
  content text,
  updated_by uuid not null references public.users(id) on delete cascade,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
before update on public.projects
for each row execute procedure public.set_updated_at();

create trigger annotations_set_updated_at
before update on public.annotations
for each row execute procedure public.set_updated_at();
