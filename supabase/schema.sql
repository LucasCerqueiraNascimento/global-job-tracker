-- Global Job Tracker - initial schema
-- Run only after creating the dedicated Supabase project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  country text,
  country_code text,
  city text,
  website text,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  role_title text not null,
  status text not null default 'Aguardando' check (status in ('Aguardando','Follow-up','Resposta recebida','Entrevista','Oferta','Recusada','Vaga encerrada','Falha de entrega')),
  source text not null default 'Email' check (source in ('Email','Portal','LinkedIn','Outro')),
  stage text,
  applied_at date not null default current_date,
  follow_up_at date,
  source_url text,
  recipient_email text,
  cv_name text,
  cover_letter_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  application_id uuid references public.applications(id) on delete cascade,
  gmail_message_id text unique,
  gmail_thread_id text,
  direction text not null check (direction in ('sent','received')),
  sender text,
  recipient text,
  subject text,
  body_preview text,
  sent_at timestamptz,
  classification text,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  application_id uuid references public.applications(id) on delete cascade,
  activity_type text not null,
  details jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists applications_owner_status_idx on public.applications(owner_id, status);
create index if not exists applications_owner_followup_idx on public.applications(owner_id, follow_up_at);
create index if not exists emails_thread_idx on public.emails(gmail_thread_id);

alter table public.profiles enable row level security;
alter table public.candidates enable row level security;
alter table public.companies enable row level security;
alter table public.applications enable row level security;
alter table public.emails enable row level security;
alter table public.activities enable row level security;

grant select, insert, update, delete on public.profiles, public.candidates, public.companies, public.applications, public.emails, public.activities to authenticated;

create policy "profiles_own_rows" on public.profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "candidates_own_rows" on public.candidates for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "companies_own_rows" on public.companies for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "applications_own_rows" on public.applications for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "emails_own_rows" on public.emails for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "activities_own_rows" on public.activities for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);


-- Cover foreign keys used by joins and owner-scoped queries.
create index if not exists activities_application_id_idx on public.activities(application_id);
create index if not exists activities_owner_id_idx on public.activities(owner_id);
create index if not exists applications_candidate_id_idx on public.applications(candidate_id);
create index if not exists applications_company_id_idx on public.applications(company_id);
create index if not exists candidates_owner_id_idx on public.candidates(owner_id);
create index if not exists companies_owner_id_idx on public.companies(owner_id);
create index if not exists emails_application_id_idx on public.emails(application_id);
create index if not exists emails_owner_id_idx on public.emails(owner_id);

-- owner_id is nullable only to support private staged imports.
-- RLS policies intentionally do not expose rows whose owner_id is null.
