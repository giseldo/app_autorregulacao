-- Permite direcionar uma recomendação a um aluno individual do roster do
-- Classroom que ainda não fez login no app (sem profiles.id ainda). O aluno
-- recebe normalmente no Classroom; o registro só passa a aparecer no
-- histórico dentro do app depois que ele loga e é reconciliado (ver
-- app/auth/callback/route.ts).
alter table public.recommendations add column if not exists roster_email text;

-- Broadcast real (visível pra turma inteira matriculada) só quando
-- student_id E roster_email são nulos — senão um envio individual por
-- e-mail (roster_email setado, student_id ainda nulo por falta de login)
-- ficaria visível pra turma inteira até a reconciliação.
drop policy if exists "recommendations_select" on public.recommendations;
create policy "recommendations_select" on public.recommendations
  for select using (
    teacher_id = auth.uid()
    or student_id = auth.uid()
    or (student_id is null and roster_email is null and public.is_enrolled(course_id))
  );
