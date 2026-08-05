import "server-only";
import { createClient } from "@/lib/supabase/server";
import { scoreConstructs, ALL_CONSTRUCTS } from "@/lib/mslq";
import type { Profile, MslqApplication, MslqQuestion, Course } from "@/lib/supabase/types";

export interface StudentOverview {
  /** null = aluno ainda não fez o primeiro login (só existe em course_roster) */
  profile: Profile | null;
  name: string;
  email: string;
  applicationsCount: number;
  latest: { application: MslqApplication; scores: Record<string, number> } | null;
  /** Média de todos os construtos (Ansiedade invertida) — um único número de "risco". */
  overallScore: number | null;
}

/** Turma "ativa" do professor = a mais recentemente sincronizada. Simplificação
 * deliberada em relação a suportar múltiplas turmas simultâneas na UI (mesmo
 * modelo de "uma turma selecionada por vez" que o Streamlit usava). */
export async function getActiveCourse(teacherId: string): Promise<Course | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ?? null;
}

export async function getCourseOverview(
  courseId: string
): Promise<{ students: StudentOverview[]; questions: MslqQuestion[] }> {
  const supabase = await createClient();

  const [{ data: enrollments }, { data: questions }, { data: roster }] = await Promise.all([
    supabase.from("enrollments").select("student_id, profiles(*)").eq("course_id", courseId),
    supabase.from("mslq_questions").select("*"),
    supabase.from("course_roster").select("*").eq("course_id", courseId),
  ]);

  const students = (enrollments ?? [])
    .map((e) => (e as unknown as { profiles: Profile | null }).profiles)
    .filter((p): p is Profile => p !== null);

  const enrolledEmails = new Set(students.map((s) => s.email));

  const studentIds = students.map((s) => s.id);

  const { data: applications } = studentIds.length
    ? await supabase
        .from("mslq_applications")
        .select("*")
        .in("student_id", studentIds)
        .order("applied_at", { ascending: true })
    : { data: [] as MslqApplication[] };

  const appIds = (applications ?? []).map((a) => a.id);
  const { data: answers } = appIds.length
    ? await supabase.from("mslq_answers").select("*").in("application_id", appIds)
    : { data: [] };

  const overview: StudentOverview[] = students.map((profile) => {
    const studentApps = (applications ?? []).filter((a) => a.student_id === profile.id);
    const applicationsCount = studentApps.length;
    const last = studentApps[studentApps.length - 1] ?? null;

    if (!last) {
      return { profile, name: profile.name, email: profile.email, applicationsCount, latest: null, overallScore: null };
    }

    const answersMap: Record<string, number> = {};
    for (const a of answers ?? []) {
      if (a.application_id === last.id) answersMap[a.id_questao] = a.valor;
    }
    const scores = scoreConstructs(questions ?? [], answersMap);

    const normalized = ALL_CONSTRUCTS.map((c) => {
      const v = scores[c.constructo];
      if (v == null) return null;
      return c.invertido ? 8 - v : v;
    }).filter((v): v is number => v !== null);

    const overallScore = normalized.length
      ? normalized.reduce((a, b) => a + b, 0) / normalized.length
      : null;

    return {
      profile,
      name: profile.name,
      email: profile.email,
      applicationsCount,
      latest: { application: last, scores },
      overallScore,
    };
  });

  // Alunos que o professor já sincronizou do Classroom mas que ainda não
  // fizeram o primeiro login no app (sem profiles/enrollments ainda).
  const pending: StudentOverview[] = (roster ?? [])
    .filter((r) => !enrolledEmails.has(r.email))
    .map((r) => ({
      profile: null,
      name: r.name,
      email: r.email,
      applicationsCount: 0,
      latest: null,
      overallScore: null,
    }));

  const all = [...overview, ...pending].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return { students: all, questions: questions ?? [] };
}
