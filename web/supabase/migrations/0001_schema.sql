-- NeoAVA-ARA — schema inicial
-- Reconstrução do app Streamlit (MSLQ + Google Classroom) em Supabase.
-- Big Five foi removido por decisão do usuário; MSLQ é o único instrumento.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- PERFIS (aluno / professor)
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text check (role in ('aluno', 'professor')),
  name text not null,
  email text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- TURMAS (sincronizadas do Google Classroom pelo professor)
-- ─────────────────────────────────────────────
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  google_course_id text unique not null,
  name text not null,
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  limite numeric not null default 4,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  course_id uuid not null references public.courses (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (course_id, student_id)
);

-- Turma sincronizada do Classroom ANTES do aluno logar no app pela 1ª vez.
-- profiles.id só existe depois do login (é o auth.users.id), então o roster
-- puro do Classroom (nome/e-mail/google_user_id) fica aqui até o aluno logar;
-- o callback de login (app/auth/callback/route.ts) casa por e-mail e cria a
-- enrollment real na hora.
create table if not exists public.course_roster (
  course_id uuid not null references public.courses (id) on delete cascade,
  email text not null,
  name text not null,
  google_user_id text not null,
  created_at timestamptz not null default now(),
  primary key (course_id, email)
);

-- ─────────────────────────────────────────────
-- TOKENS GOOGLE (só professor, só acesso server-side / service role)
-- Guarda o refresh_token para renovar o access token da Classroom API
-- fora da janela de vida do provider_token que o Supabase Auth devolve no login.
-- ─────────────────────────────────────────────
create table if not exists public.google_tokens (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  refresh_token text not null,
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- BANCO DE QUESTÕES MSLQ (44 perguntas / 13 construtos)
-- seed em 0003_seed_mslq_questions.sql, a partir de datasets/mslq.csv
-- ─────────────────────────────────────────────
create table if not exists public.mslq_questions (
  id_questao text primary key,
  tipo text not null,
  constructo text not null,
  dsc_questao text not null,
  ordem integer not null unique,
  reversa boolean not null default false -- item com pontuação invertida (8 - valor) no cálculo do construto
);

-- Uma "aplicação" = uma vez que o aluno respondeu o questionário inteiro.
-- Pode haver várias por aluno/turma ao longo do período (antes/depois de recomendações).
create table if not exists public.mslq_applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid references public.courses (id) on delete set null,
  label text,
  applied_at timestamptz not null default now()
);

create table if not exists public.mslq_answers (
  application_id uuid not null references public.mslq_applications (id) on delete cascade,
  id_questao text not null references public.mslq_questions (id_questao),
  valor smallint not null check (valor between 1 and 7),
  primary key (application_id, id_questao)
);

-- ─────────────────────────────────────────────
-- CATÁLOGO DE RECOMENDAÇÕES (dicas.csv)
-- ─────────────────────────────────────────────
create table if not exists public.recommendation_templates (
  id integer primary key,
  tipo text not null,
  titulo text not null,
  constructo_grupo text not null,
  texto text not null
);

create table if not exists public.recommendation_template_constructs (
  template_id integer not null references public.recommendation_templates (id) on delete cascade,
  constructo text not null,
  primary key (template_id, constructo)
);

-- ─────────────────────────────────────────────
-- RECOMENDAÇÕES ENVIADAS (grava no app + espelha no Google Classroom)
-- ─────────────────────────────────────────────
create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid references public.profiles (id) on delete cascade, -- null = turma toda
  course_id uuid not null references public.courses (id) on delete cascade,
  constructo text,
  title text not null,
  content text not null,
  classroom_courseworkmaterial_id text,
  auto boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.recommendation_reads (
  recommendation_id uuid not null references public.recommendations (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (recommendation_id, student_id)
);

create index if not exists idx_mslq_applications_student on public.mslq_applications (student_id);
create index if not exists idx_mslq_applications_course on public.mslq_applications (course_id);
create index if not exists idx_recommendations_student on public.recommendations (student_id);
create index if not exists idx_recommendations_course on public.recommendations (course_id);
create index if not exists idx_enrollments_student on public.enrollments (student_id);
