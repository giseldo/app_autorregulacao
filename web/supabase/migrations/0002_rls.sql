-- NeoAVA-ARA — Row Level Security
-- Funções auxiliares (SECURITY DEFINER) evitam repetir joins em toda policy
-- e evitam recursão entre policies de courses/enrollments.

create or replace function public.is_teacher_of_course(p_course_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.courses c
    where c.id = p_course_id and c.teacher_id = auth.uid()
  );
$$;

create or replace function public.is_enrolled(p_course_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.enrollments e
    where e.course_id = p_course_id and e.student_id = auth.uid()
  );
$$;

create or replace function public.is_teacher_of_student(p_student_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.enrollments e
    join public.courses c on c.id = e.course_id
    where e.student_id = p_student_id and c.teacher_id = auth.uid()
  );
$$;

-- ─────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.google_tokens enable row level security;
alter table public.course_roster enable row level security;
alter table public.mslq_questions enable row level security;
alter table public.mslq_applications enable row level security;
alter table public.mslq_answers enable row level security;
alter table public.recommendation_templates enable row level security;
alter table public.recommendation_template_constructs enable row level security;
alter table public.recommendations enable row level security;
alter table public.recommendation_reads enable row level security;

-- profiles: cada um vê/edita o próprio perfil; professor vê perfis dos alunos que dá aula
create policy "profiles_select_self" on public.profiles
  for select using (id = auth.uid() or public.is_teacher_of_student(id));
create policy "profiles_insert_self" on public.profiles
  for insert with check (id = auth.uid());
create policy "profiles_update_self" on public.profiles
  for update using (id = auth.uid());

-- courses: professor gerencia as próprias turmas; aluno vê turmas em que está matriculado
create policy "courses_select" on public.courses
  for select using (teacher_id = auth.uid() or public.is_enrolled(id));
create policy "courses_insert" on public.courses
  for insert with check (teacher_id = auth.uid());
create policy "courses_update" on public.courses
  for update using (teacher_id = auth.uid());
create policy "courses_delete" on public.courses
  for delete using (teacher_id = auth.uid());

-- enrollments: professor da turma gerencia; aluno vê a própria matrícula
create policy "enrollments_select" on public.enrollments
  for select using (student_id = auth.uid() or public.is_teacher_of_course(course_id));
create policy "enrollments_insert" on public.enrollments
  for insert with check (public.is_teacher_of_course(course_id));
create policy "enrollments_delete" on public.enrollments
  for delete using (public.is_teacher_of_course(course_id));

-- google_tokens: nenhuma policy = acesso negado para anon/authenticated;
-- só service role (que ignora RLS) lê/escreve, a partir de rotas server-side.

-- course_roster: escrita só via service role (sincronização com a Classroom API);
-- professor pode visualizar o roster da própria turma.
create policy "course_roster_select" on public.course_roster
  for select using (public.is_teacher_of_course(course_id));

-- mslq_questions / templates: catálogo de referência, leitura pública para logados
create policy "mslq_questions_select" on public.mslq_questions
  for select using (auth.role() = 'authenticated');
create policy "recommendation_templates_select" on public.recommendation_templates
  for select using (auth.role() = 'authenticated');
create policy "recommendation_template_constructs_select" on public.recommendation_template_constructs
  for select using (auth.role() = 'authenticated');

-- mslq_applications: aluno lê/cria as próprias; professor lê as dos seus alunos
create policy "mslq_applications_select" on public.mslq_applications
  for select using (student_id = auth.uid() or public.is_teacher_of_student(student_id));
create policy "mslq_applications_insert" on public.mslq_applications
  for insert with check (
    student_id = auth.uid()
    and (course_id is null or public.is_enrolled(course_id))
  );

-- mslq_answers: segue a visibilidade da aplicação
create policy "mslq_answers_select" on public.mslq_answers
  for select using (
    exists (
      select 1 from public.mslq_applications a
      where a.id = application_id
        and (a.student_id = auth.uid() or public.is_teacher_of_student(a.student_id))
    )
  );
create policy "mslq_answers_insert" on public.mslq_answers
  for insert with check (
    exists (
      select 1 from public.mslq_applications a
      where a.id = application_id and a.student_id = auth.uid()
    )
  );

-- recommendations: professor autor vê/gerencia; aluno-alvo ou turma-alvo vê
create policy "recommendations_select" on public.recommendations
  for select using (
    teacher_id = auth.uid()
    or student_id = auth.uid()
    or (student_id is null and public.is_enrolled(course_id))
  );
create policy "recommendations_insert" on public.recommendations
  for insert with check (teacher_id = auth.uid() and public.is_teacher_of_course(course_id));
create policy "recommendations_update" on public.recommendations
  for update using (teacher_id = auth.uid());

-- recommendation_reads: aluno marca/lê as próprias leituras
create policy "recommendation_reads_select" on public.recommendation_reads
  for select using (student_id = auth.uid());
create policy "recommendation_reads_insert" on public.recommendation_reads
  for insert with check (
    student_id = auth.uid()
    and exists (
      select 1 from public.recommendations r
      where r.id = recommendation_id
        and (r.student_id = auth.uid() or (r.student_id is null and public.is_enrolled(r.course_id)))
    )
  );
