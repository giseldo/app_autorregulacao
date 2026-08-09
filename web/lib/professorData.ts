import "server-only";
import { createClient } from "@/lib/supabase/server";
import { scoreConstructs, ALL_CONSTRUCTS } from "@/lib/mslq";
import type { Profile, MslqApplication, MslqQuestion, Course, MslqRound } from "@/lib/supabase/types";

export interface StudentOverview {
  /** null = aluno ainda não fez o primeiro login (do course_roster, ou só
   * identificado por e-mail/nome numa aplicação importada de planilha). */
  profile: Profile | null;
  name: string;
  email: string;
  applicationsCount: number;
  latest: { application: MslqApplication; scores: Record<string, number> } | null;
  /** Média de todos os construtos (Ansiedade invertida) — um único número de "risco". */
  overallScore: number | null;
  /** Última aplicação de cada rodada da pesquisa (pré-teste/pós-teste/3ª aplicação),
   * usada para mostrar a evolução do aluno ao longo do tempo, não só a foto atual. */
  byRound: Partial<Record<MslqRound, { application: MslqApplication; scores: Record<string, number>; overallScore: number }>>;
}

function overallOf(scores: Record<string, number>): number {
  const normalized = ALL_CONSTRUCTS.map((c) => {
    const v = scores[c.constructo];
    if (v == null) return null;
    return c.invertido ? 8 - v : v;
  }).filter((v): v is number => v !== null);
  return normalized.length ? normalized.reduce((a, b) => a + b, 0) / normalized.length : 0;
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

function scoresFor(
  application: MslqApplication,
  questions: MslqQuestion[],
  answers: { application_id: string; id_questao: string; valor: number }[]
): Record<string, number> {
  const answersMap: Record<string, number> = {};
  for (const a of answers) {
    if (a.application_id === application.id) answersMap[a.id_questao] = a.valor;
  }
  return scoreConstructs(questions, answersMap);
}

function summarize(
  apps: MslqApplication[],
  questions: MslqQuestion[],
  answers: { application_id: string; id_questao: string; valor: number }[],
  profile: Profile | null,
  name: string,
  email: string
): StudentOverview {
  const applicationsCount = apps.length;
  const last = apps[apps.length - 1] ?? null;

  const byRound: StudentOverview["byRound"] = {};
  for (const round of ["pre", "pos", "extra"] as MslqRound[]) {
    const matches = apps.filter((a) => a.round === round);
    const application = matches[matches.length - 1];
    if (!application) continue;
    const scores = scoresFor(application, questions, answers);
    byRound[round] = { application, scores, overallScore: overallOf(scores) };
  }

  if (!last) {
    return { profile, name, email, applicationsCount, latest: null, overallScore: null, byRound };
  }

  const scores = scoresFor(last, questions, answers);
  const overallScore = overallOf(scores);

  return { profile, name, email, applicationsCount, latest: { application: last, scores }, overallScore, byRound };
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

  // Aplicações de alunos já logados (mesmo se o course_id delas ficou nulo por
  // terem sido respondidas antes da matrícula existir) + aplicações importadas
  // por e-mail (sem student_id ainda) para esta turma — é isso que faz o
  // professor enxergar dados de quem nunca fez login no app.
  const [{ data: appsByStudent }, { data: appsByRoster }] = await Promise.all([
    studentIds.length
      ? supabase
          .from("mslq_applications")
          .select("*")
          .in("student_id", studentIds)
          .order("applied_at", { ascending: true })
      : Promise.resolve({ data: [] as MslqApplication[] }),
    supabase
      .from("mslq_applications")
      .select("*")
      .eq("course_id", courseId)
      .is("student_id", null)
      .order("applied_at", { ascending: true }),
  ]);

  const applications = [...(appsByStudent ?? []), ...(appsByRoster ?? [])];
  const appIds = applications.map((a) => a.id);
  const { data: answers } = appIds.length
    ? await supabase.from("mslq_answers").select("*").in("application_id", appIds)
    : { data: [] };

  const overview: StudentOverview[] = students.map((profile) => {
    const studentApps = applications.filter((a) => a.student_id === profile.id);
    return summarize(studentApps, questions ?? [], answers ?? [], profile, profile.name, profile.email);
  });

  // Alunos que o professor já sincronizou do Classroom mas que ainda não
  // fizeram o primeiro login no app (sem profiles/enrollments ainda) — se
  // houver aplicações importadas por e-mail pra eles, aparecem aqui com dados.
  const pending: StudentOverview[] = (roster ?? [])
    .filter((r) => !enrolledEmails.has(r.email))
    .map((r) => {
      const rosterApps = applications.filter((a) => a.student_id === null && a.roster_email === r.email);
      return summarize(rosterApps, questions ?? [], answers ?? [], null, r.name, r.email);
    });

  // Respondentes importados cujo e-mail não está nem em profiles nem no
  // roster do Classroom (ex: e-mail pessoal usado no Google Forms) — sem
  // isso ficariam invisíveis pro professor mesmo tendo dado real importado.
  const knownEmails = new Set([...enrolledEmails, ...(roster ?? []).map((r) => r.email)]);
  const extraEmails = new Map<string, string>();
  for (const a of appsByRoster ?? []) {
    if (a.roster_email && !knownEmails.has(a.roster_email) && !extraEmails.has(a.roster_email)) {
      extraEmails.set(a.roster_email, a.roster_name ?? a.roster_email);
    }
  }
  const unmatched: StudentOverview[] = [...extraEmails.entries()].map(([email, name]) => {
    const rosterApps = applications.filter((a) => a.student_id === null && a.roster_email === email);
    return summarize(rosterApps, questions ?? [], answers ?? [], null, name, email);
  });

  const all = [...overview, ...pending, ...unmatched].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return { students: all, questions: questions ?? [] };
}
