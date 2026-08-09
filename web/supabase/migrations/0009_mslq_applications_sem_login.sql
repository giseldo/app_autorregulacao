-- Permite que uma aplicação do MSLQ exista para um aluno que ainda não fez
-- login no app — necessário pra importar em massa os dados reais de
-- pré/pós-teste (Google Forms) coletados fora do app, cujos respondentes na
-- maioria das vezes ainda não têm profiles.id (mesmo padrão já usado em
-- course_roster / recommendations.roster_email).
alter table public.mslq_applications alter column student_id drop not null;
alter table public.mslq_applications add column if not exists roster_email text;
alter table public.mslq_applications add column if not exists roster_name text;

-- 'pre'/'pos'/'extra' identificam de forma estruturada as rodadas da
-- pesquisa (pré-teste, pós-teste, terceira aplicação/análise), em vez de
-- depender só da ordem cronológica ou do texto livre de `label`.
-- Aplicações do questionário auto-respondido pelo aluno dentro do app
-- continuam com `round` nulo.
alter table public.mslq_applications add column if not exists round text;
alter table public.mslq_applications drop constraint if exists mslq_applications_round_check;
alter table public.mslq_applications add constraint mslq_applications_round_check
  check (round is null or round in ('pre', 'pos', 'extra'));

alter table public.mslq_applications drop constraint if exists mslq_applications_identity_check;
alter table public.mslq_applications add constraint mslq_applications_identity_check
  check (student_id is not null or roster_email is not null);

-- Professor precisa enxergar aplicações importadas por e-mail mesmo sem o
-- aluno ter logado — is_teacher_of_student(student_id) não funciona quando
-- student_id é nulo, então passa a valer também is_teacher_of_course.
drop policy if exists "mslq_applications_select" on public.mslq_applications;
create policy "mslq_applications_select" on public.mslq_applications
  for select using (
    student_id = auth.uid()
    or public.is_teacher_of_student(student_id)
    or public.is_teacher_of_course(course_id)
  );

drop policy if exists "mslq_answers_select" on public.mslq_answers;
create policy "mslq_answers_select" on public.mslq_answers
  for select using (
    exists (
      select 1 from public.mslq_applications a
      where a.id = application_id
        and (
          a.student_id = auth.uid()
          or public.is_teacher_of_student(a.student_id)
          or public.is_teacher_of_course(a.course_id)
        )
    )
  );
