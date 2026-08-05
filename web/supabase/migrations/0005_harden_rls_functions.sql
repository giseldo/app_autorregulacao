-- Endurece as funções auxiliares de RLS (is_teacher_of_course, is_enrolled,
-- is_teacher_of_student). Elas só deveriam ser chamadas implicitamente pelas
-- policies em nome de um usuário logado, não diretamente via
-- /rest/v1/rpc/<função> por qualquer um.
--
-- Pegadinha: `revoke execute ... from public` NÃO basta no Supabase. O projeto
-- roda `alter default privileges in schema public grant execute on functions
-- to anon, authenticated, service_role`, então toda função nova já nasce com
-- EXECUTE concedido diretamente a anon/authenticated (não só via PUBLIC) — é
-- preciso revogar de `anon` explicitamente. `authenticated` continua podendo
-- executar de propósito: é o papel usado pelas policies de RLS em produção.
revoke execute on function public.is_teacher_of_course(uuid) from public;
revoke execute on function public.is_enrolled(uuid) from public;
revoke execute on function public.is_teacher_of_student(uuid) from public;

revoke execute on function public.is_teacher_of_course(uuid) from anon;
revoke execute on function public.is_enrolled(uuid) from anon;
revoke execute on function public.is_teacher_of_student(uuid) from anon;

grant execute on function public.is_teacher_of_course(uuid) to authenticated;
grant execute on function public.is_enrolled(uuid) to authenticated;
grant execute on function public.is_teacher_of_student(uuid) to authenticated;
