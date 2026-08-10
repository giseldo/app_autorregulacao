import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { scoreConstructs, ALL_CONSTRUCTS } from "@/lib/mslq";
import { getTeacherAccessToken, createCourseWorkMaterial, GoogleTokenMissingError } from "@/lib/google/classroom";
import type { Course, MslqAnswer, MslqApplication, MslqQuestion, Profile } from "@/lib/supabase/types";

/** Não reenvia dica automática pro mesmo aluno/construto dentro desse prazo,
 * mesmo que ele continue abaixo do limite — evita spammar o Classroom toda
 * vez que o cron roda. */
const COOLDOWN_DAYS = 7;

export interface AutoTipResult {
  courseId: string;
  courseName: string;
  /** aluno recebeu uma dica nova nesta execução */
  sent: { studentEmail: string; constructo: string }[];
  /** aluno sem necessidade (score ok), sem aplicação ainda, ou em cooldown */
  skipped: number;
  errors: string[];
}

/** Para um aluno, o construto mais abaixo do limite na aplicação mais
 * recente — null se nenhum construto estiver abaixo (nada a recomendar). */
function lowestConstruct(
  scores: Record<string, number>,
  limite: number
): { constructo: string; invertido?: boolean } | null {
  const below = ALL_CONSTRUCTS.map((c) => ({ c, v: scores[c.constructo] }))
    .filter((x): x is { c: (typeof ALL_CONSTRUCTS)[number]; v: number } => x.v != null)
    .filter((x) => (x.c.invertido ? x.v >= limite : x.v < limite))
    .sort((a, b) => (a.c.invertido ? b.v - a.v : a.v - b.v));

  return below.length > 0 ? below[0].c : null;
}

/** Roda a dica automática para UMA turma: olha a aplicação mais recente de
 * cada aluno matriculado, acha o construto mais baixo (fora do cooldown) e
 * envia o template de recomendação correspondente — em `recommendations`
 * (auto = true) e, se possível, publicado no Classroom. Usa o admin client
 * porque roda tanto por cron (sem sessão) quanto disparado pelo professor. */
export async function runAutoTipForCourse(courseId: string): Promise<AutoTipResult> {
  const admin = createAdminClient();
  const result: AutoTipResult = { courseId, courseName: "", sent: [], skipped: 0, errors: [] };

  const { data: course } = await admin.from("courses").select("*").eq("id", courseId).maybeSingle();
  if (!course) {
    result.errors.push("Turma não encontrada.");
    return result;
  }
  result.courseName = course.name;

  const [{ data: enrollments }, { data: questions }, { data: templates }, { data: templateConstructs }] =
    await Promise.all([
      admin.from("enrollments").select("student_id, profiles(*)").eq("course_id", courseId),
      admin.from("mslq_questions").select("*"),
      admin.from("recommendation_templates").select("*"),
      admin.from("recommendation_template_constructs").select("*"),
    ]);

  const students = (enrollments ?? [])
    .map((e) => (e as unknown as { profiles: Profile | null }).profiles)
    .filter((p): p is Profile => p !== null);

  if (students.length === 0) return result;

  const studentIds = students.map((s) => s.id);
  const { data: apps } = await admin
    .from("mslq_applications")
    .select("*")
    .in("student_id", studentIds)
    .order("applied_at", { ascending: true });
  const appIds = (apps ?? []).map((a) => a.id);
  const { data: answers } = appIds.length
    ? await admin.from("mslq_answers").select("*").in("application_id", appIds)
    : { data: [] as MslqAnswer[] };

  const cutoff = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentAuto } = await admin
    .from("recommendations")
    .select("student_id, constructo, created_at")
    .eq("course_id", courseId)
    .eq("auto", true)
    .gte("created_at", cutoff);
  const cooldownSet = new Set((recentAuto ?? []).map((r) => `${r.student_id}::${r.constructo}`));

  let accessToken: string | null = null;
  let tokenError: string | null = null;

  for (const student of students) {
    const studentApps = (apps as MslqApplication[] | null)?.filter((a) => a.student_id === student.id) ?? [];
    const last = studentApps[studentApps.length - 1];
    if (!last) {
      result.skipped++;
      continue;
    }

    const answersMap: Record<string, number> = {};
    for (const a of (answers as MslqAnswer[] | null) ?? []) {
      if (a.application_id === last.id) answersMap[a.id_questao] = a.valor;
    }
    const scores = scoreConstructs((questions as MslqQuestion[] | null) ?? [], answersMap);
    const target = lowestConstruct(scores, course.limite);

    if (!target || cooldownSet.has(`${student.id}::${target.constructo}`)) {
      result.skipped++;
      continue;
    }

    const tc = (templateConstructs ?? []).find((t) => t.constructo === target.constructo);
    const template = tc ? (templates ?? []).find((t) => t.id === tc.template_id) : undefined;
    if (!template) {
      result.skipped++;
      continue;
    }

    const { data: rec, error: insertError } = await admin
      .from("recommendations")
      .insert({
        teacher_id: course.teacher_id,
        student_id: student.id,
        roster_email: null,
        course_id: course.id,
        constructo: target.constructo,
        title: template.titulo,
        content: template.texto,
        auto: true,
      })
      .select("id")
      .single();

    if (insertError || !rec) {
      result.errors.push(`${student.email}: ${insertError?.message ?? "falha ao salvar a recomendação."}`);
      continue;
    }

    if (!tokenError) {
      try {
        if (!accessToken) accessToken = await getTeacherAccessToken(course.teacher_id);
        const material = await createCourseWorkMaterial(accessToken, course.google_course_id, {
          title: template.titulo,
          description: template.texto,
          studentEmails: [student.email],
        });
        await admin.from("recommendations").update({ classroom_courseworkmaterial_id: material.id }).eq("id", rec.id);
      } catch (e) {
        // best-effort: a recomendação já está salva no app; só a publicação no Classroom falhou.
        // Não é reportado por aluno para não poluir o resultado — professor com token Google
        // não configurado receberia o mesmo erro N vezes.
        tokenError = e instanceof GoogleTokenMissingError ? e.message : e instanceof Error ? e.message : "erro desconhecido";
      }
    }

    result.sent.push({ studentEmail: student.email, constructo: target.constructo });
  }

  if (tokenError) result.errors.push(`Google Classroom: ${tokenError}`);
  return result;
}

/** Roda a dica automática para todas as turmas de todos os professores —
 * ponto de entrada do cron semanal (ver app/api/cron/auto-tip/route.ts). */
export async function runAutoTipsForAllCourses(): Promise<AutoTipResult[]> {
  const admin = createAdminClient();
  const { data: courses } = await admin.from("courses").select("*");
  const results: AutoTipResult[] = [];
  for (const course of (courses ?? []) as Course[]) {
    results.push(await runAutoTipForCourse(course.id));
  }
  return results;
}
