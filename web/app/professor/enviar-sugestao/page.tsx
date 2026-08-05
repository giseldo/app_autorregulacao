import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveCourse, getCourseOverview } from "@/lib/professorData";
import { ALL_CONSTRUCTS } from "@/lib/mslq";
import { SendRecommendationForm, type StudentOption } from "@/components/SendRecommendationForm";

export default async function EnviarSugestaoPage({
  searchParams,
}: {
  searchParams: Promise<{ student_id?: string }>;
}) {
  const { profile } = await requireProfile("professor");
  const course = await getActiveCourse(profile.id);
  const { student_id } = await searchParams;

  if (!course) {
    return (
      <>
        <div className="page-header">
          <h2>Enviar Sugestão ✉️</h2>
        </div>
        <div className="empty-state">
          <div className="icon">🏫</div>
          <p>
            Sincronize uma turma em{" "}
            <Link href="/professor/turma" style={{ color: "var(--primary)" }}>
              Turma
            </Link>{" "}
            antes de enviar sugestões.
          </p>
        </div>
      </>
    );
  }

  const supabase = await createClient();
  const [{ students }, { data: templates }] = await Promise.all([
    getCourseOverview(course.id),
    supabase.from("recommendation_templates").select("*").order("id", { ascending: true }),
  ]);

  // Aluno que ainda não logou no app (sem profile) também pode receber
  // sugestão individual: usamos o e-mail do roster do Classroom como alvo
  // (prefixo "email:") em vez de profiles.id — publica no Classroom por
  // e-mail e fica pendente de reconciliação com o histórico do app até ele
  // logar pela 1ª vez (ver app/auth/callback/route.ts).
  const pendingCount = students.filter((s) => !s.profile).length;

  const studentOptions: StudentOption[] = students.map((s) => {
    const lowConstructs = s.latest
      ? ALL_CONSTRUCTS.filter((c) => {
          const v = s.latest!.scores[c.constructo];
          if (v == null) return false;
          return c.invertido ? v >= course.limite : v < course.limite;
        }).map((c) => `${c.icon} ${c.label}`)
      : [];

    return {
      id: s.profile ? s.profile.id : `email:${s.email}`,
      name: s.name,
      email: s.email,
      overallScore: s.overallScore,
      lowConstructs,
      hasLogin: s.profile !== null,
    };
  });

  return (
    <>
      <div className="page-header">
        <h2>Enviar Sugestão ✉️</h2>
        <p>
          Turma: <strong>{course.name}</strong> — a sugestão é salva no app e publicada no Google Classroom.
        </p>
      </div>
      {pendingCount > 0 && (
        <div className="alert alert-info">
          <span>ℹ️</span>
          <div>
            {pendingCount} aluno(s) da turma ainda não fizeram o primeiro login no app (marcados com ⏳ na lista) —
            dá pra enviar sugestão individual mesmo assim, publicada no Classroom por e-mail; ela só passa a
            aparecer no histórico dentro do app depois que o aluno logar pela 1ª vez.
          </div>
        </div>
      )}
      <SendRecommendationForm
        courseId={course.id}
        students={studentOptions}
        templates={templates ?? []}
        defaultStudentId={student_id}
        limite={course.limite}
      />
    </>
  );
}
