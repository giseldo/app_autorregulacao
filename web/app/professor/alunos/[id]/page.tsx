import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ALL_CONSTRUCTS, scoreConstructs, statusFor } from "@/lib/mslq";
import { RadarChart } from "@/components/charts/RadarChart";
import { LineChart } from "@/components/charts/LineChart";
import { ApplicationsComparison, type ScoredApplication } from "@/components/ApplicationsComparison";
import { PrePosComparison } from "@/components/PrePosComparison";
import type { MslqApplication, Recommendation } from "@/lib/supabase/types";

const PALETTE = [
  "#F59E0B", "#0EA5E9", "#8B5CF6", "#10B981", "#EF4444", "#EC4899", "#14B8A6",
  "#F97316", "#3B82F6", "#84CC16", "#A855F7", "#06B6D4", "#F43F5E",
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
function fmtDateFull(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function AlunoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireProfile("professor");
  const { id: rawId } = await params;
  // O segmento dinâmico chega aqui ainda percent-encoded (ex: "email%3Afoo%2540bar.com"
  // em vez de "email:foo@bar.com") — o link já manda encodeURIComponent(email), então
  // sem decodificar aqui o startsWith("email:") abaixo falha e o "@"/":" viram um "id"
  // inválido, quebrando a query de profiles com erro 400. decodeURIComponent é seguro
  // mesmo se o valor já vier decodificado (string sem "%" fica inalterada).
  const id = decodeURIComponent(rawId);
  const supabase = await createClient();

  // "email:<endereco>" identifica um aluno que ainda não fez login no app
  // (mesma convenção usada em enviar-sugestao?student_id=email:...) — os dados
  // dele (importados de planilha) ficam em mslq_applications.roster_email.
  const rosterEmail = id.startsWith("email:") ? id.slice("email:".length) : null;

  let student: { id: string | null; name: string; email: string };
  let limite = 4;
  let applications: MslqApplication[] | null;
  let recs: Recommendation[] | null;

  if (rosterEmail) {
    // Nem todo respondente importado por e-mail está no course_roster (ex:
    // e-mail usado no Google Forms não bate com o e-mail sincronizado do
    // Classroom) — sem esse fallback, clicar num aluno desses dava 404.
    const [{ data: roster }, applicationsResult, recsResult] = await Promise.all([
      supabase.from("course_roster").select("*").eq("email", rosterEmail).maybeSingle(),
      supabase.from("mslq_applications").select("*").eq("roster_email", rosterEmail).order("applied_at", { ascending: true }),
      supabase.from("recommendations").select("*").eq("roster_email", rosterEmail).order("created_at", { ascending: false }),
    ]);
    applications = applicationsResult.data;
    recs = recsResult.data;

    if (!roster && !applications?.length) notFound();

    const courseId = roster?.course_id ?? applications?.[0]?.course_id ?? null;
    if (courseId) {
      const { data: course } = await supabase.from("courses").select("limite").eq("id", courseId).maybeSingle();
      limite = course?.limite ?? 4;
    }
    student = { id: null, name: roster?.name ?? applications?.[0]?.roster_name ?? rosterEmail, email: rosterEmail };
  } else {
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    if (!profile) notFound();
    student = { id: profile.id, name: profile.name, email: profile.email };

    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("course_id, courses(limite)")
      .eq("student_id", id)
      .limit(1)
      .maybeSingle();
    limite = (enrollment as unknown as { courses: { limite: number } | null } | null)?.courses?.limite ?? 4;

    [{ data: applications }, { data: recs }] = await Promise.all([
      supabase.from("mslq_applications").select("*").eq("student_id", id).order("applied_at", { ascending: true }),
      supabase.from("recommendations").select("*").eq("student_id", id).order("created_at", { ascending: false }),
    ]);
  }

  const { data: questions } = await supabase.from("mslq_questions").select("*");

  const appList = applications ?? [];
  const appIds = appList.map((a) => a.id);
  const { data: answers } = appIds.length
    ? await supabase.from("mslq_answers").select("*").in("application_id", appIds)
    : { data: [] };

  const scoresByApplication: ScoredApplication[] = appList.map((application) => {
    const answersMap: Record<string, number> = {};
    for (const a of answers ?? []) {
      if (a.application_id === application.id) answersMap[a.id_questao] = a.valor;
    }
    return { application, scores: scoreConstructs(questions ?? [], answersMap) };
  });

  return (
    <>
      <div className="page-header flex justify-between items-center">
        <div>
          <h2>{student.name}</h2>
          <p>
            {student.email}
            {!student.id && <span className="text-xs text-muted"> · ⏳ ainda não fez login no app</span>}
          </p>
        </div>
        <Link
          href={`/professor/enviar-sugestao?student_id=${student.id ?? `email:${student.email}`}`}
          className="btn btn-primary"
        >
          ✉️ Enviar sugestão
        </Link>
      </div>

      {scoresByApplication.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📊</div>
          <p>Este aluno ainda não tem respostas do questionário (nem pelo app, nem importadas).</p>
        </div>
      ) : (
        (() => {
          const last = scoresByApplication[scoresByApplication.length - 1];
          const labels = scoresByApplication.map((s) => fmtDate(s.application.applied_at));

          const lineData = {
            labels,
            datasets: ALL_CONSTRUCTS.map((c, i) => ({
              label: c.label,
              data: scoresByApplication.map((s) => Number((s.scores[c.constructo] ?? 0).toFixed(2))),
              borderColor: PALETTE[i % PALETTE.length],
              backgroundColor: PALETTE[i % PALETTE.length] + "22",
              tension: 0.35,
              pointRadius: 4,
            })),
          };
          const radarData = {
            labels: ALL_CONSTRUCTS.map((c) => c.label),
            datasets: [
              {
                label: "Perfil atual",
                data: ALL_CONSTRUCTS.map((c) => Number((last.scores[c.constructo] ?? 0).toFixed(2))),
                backgroundColor: "rgba(79,70,229,.18)",
                borderColor: "#4F46E5",
                pointBackgroundColor: "#4F46E5",
              },
            ],
          };
          const lineOptions = {
            scales: { y: { min: 1, max: 7, ticks: { stepSize: 1 } } },
            plugins: { legend: { position: "bottom" as const, labels: { boxWidth: 10, font: { size: 10 } } } },
          };
          const radarOptions = {
            scales: { r: { min: 1, max: 7, ticks: { stepSize: 1, font: { size: 10 } } } },
            plugins: { legend: { display: false } },
          };

          return (
            <>
              <PrePosComparison applications={scoresByApplication} />

              <div className="grid-2 mb-4">
                <div className="card">
                  <div className="card-header"><h3>Perfil Atual</h3></div>
                  <div className="card-body"><div className="chart-container"><RadarChart data={radarData} options={radarOptions} /></div></div>
                </div>
                <div className="card">
                  <div className="card-header"><h3>Evolução por Construto</h3></div>
                  <div className="card-body"><div className="chart-container"><LineChart data={lineData} options={lineOptions} /></div></div>
                </div>
              </div>

              <ApplicationsComparison studentId={student.id} rosterEmail={rosterEmail} scoresByApplication={scoresByApplication} />

              <div className="card mb-4">
                <div className="card-header">
                  <h3>Aplicações</h3>
                  <span className="text-xs text-muted">{appList.length} aplicação(ões)</span>
                </div>
                <div className="card-body">
                  {[...scoresByApplication].reverse().map(({ application, scores }) => (
                    <div key={application.id} className="history-item">
                      <div className="history-date">{fmtDateFull(application.applied_at)}</div>
                      <div className="history-constructs">
                        {ALL_CONSTRUCTS.map((c) => {
                          const v = scores[c.constructo];
                          if (v == null) return null;
                          const status = statusFor(v, limite, c.invertido);
                          const cls = status === "high" ? "score-high" : "score-low";
                          return (
                            <span key={c.constructo} className={`mini-badge score-badge ${cls}`}>
                              {c.icon}
                              {v.toFixed(1)}
                            </span>
                          );
                        })}
                      </div>
                      {application.label && <div className="text-xs text-muted">{application.label}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          );
        })()
      )}

      <div className="card">
        <div className="card-header">
          <h3>Sugestões enviadas ({(recs ?? []).length})</h3>
        </div>
        <div className="card-body">
          {(!recs || recs.length === 0) && <p className="text-sm text-muted">Nenhuma sugestão enviada ainda.</p>}
          {(recs ?? []).map((r) => (
            <div key={r.id} className="rec-card">
              <div className="rec-header">
                <span className="rec-tag tag-geral">{r.constructo ?? "Geral"}</span>
                <span className="rec-date">{fmtDateFull(r.created_at)}</span>
              </div>
              <div className="rec-title" style={{ fontSize: 14 }}>{r.title}</div>
              <div className="rec-content">{r.content}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
