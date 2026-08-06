-- Configuração do chatbot (provedor/modelo/chave de API), editável pelo
-- professor na tela de Configurações em vez de fixa por variável de
-- ambiente. Linha única (truque do "id boolean" força no máximo 1 registro).
create table if not exists public.llm_settings (
  id boolean primary key default true check (id),
  provider text not null default 'groq',
  model text not null default 'llama-3.3-70b-versatile',
  api_key text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

alter table public.llm_settings enable row level security;
-- Sem policies para anon/authenticated: a linha guarda a api_key do provedor
-- LLM em texto plano, então só a service role (lib/supabase/admin.ts), a
-- partir de server actions autenticadas como professor, lê ou escreve aqui.
