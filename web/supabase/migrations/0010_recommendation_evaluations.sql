-- Avaliação da recomendação pelo aluno que a recebeu (clareza, satisfação
-- geral, se recomendaria a um colega, se ajudou a resolver a dificuldade) —
-- mesma escala 1-7 do instrumento de autorregulação. Uma avaliação por
-- (recomendação, aluno); alimenta a seção "Avaliação das recomendações" do
-- Dashboard Consolidado (média geral, % de respostas favoráveis, mediana e
-- alfa de Cronbach entre os 4 itens, calculados a partir dos dados reais).
create table if not exists public.recommendation_evaluations (
  recommendation_id uuid not null references public.recommendations (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  clareza smallint not null check (clareza between 1 and 7),
  satisfacao smallint not null check (satisfacao between 1 and 7),
  recomendaria smallint not null check (recomendaria between 1 and 7),
  resolveu_problema smallint not null check (resolveu_problema between 1 and 7),
  created_at timestamptz not null default now(),
  primary key (recommendation_id, student_id)
);

create index if not exists idx_recommendation_evaluations_recommendation
  on public.recommendation_evaluations (recommendation_id);

alter table public.recommendation_evaluations enable row level security;

-- select: o próprio aluno vê sua avaliação; o professor autor da recomendação
-- vê as avaliações recebidas (mesmo critério de autoria usado em recommendations_update).
create policy "recommendation_evaluations_select" on public.recommendation_evaluations
  for select using (
    student_id = auth.uid()
    or exists (
      select 1 from public.recommendations r
      where r.id = recommendation_id and r.teacher_id = auth.uid()
    )
  );

-- insert/update: só o aluno-alvo (ou aluno da turma, se a recomendação foi
-- pra turma toda) pode avaliar — mesma regra de visibilidade de recommendation_reads_insert.
create policy "recommendation_evaluations_insert" on public.recommendation_evaluations
  for insert with check (
    student_id = auth.uid()
    and exists (
      select 1 from public.recommendations r
      where r.id = recommendation_id
        and (r.student_id = auth.uid() or (r.student_id is null and public.is_enrolled(r.course_id)))
    )
  );

create policy "recommendation_evaluations_update" on public.recommendation_evaluations
  for update using (student_id = auth.uid());
