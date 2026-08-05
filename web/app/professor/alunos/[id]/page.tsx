import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  ALL_CONSTRUCTS,
  MOTIVACAO_CONSTRUCTS,
  ESTRATEGIA_CONSTRUCTS,
  scoreConstructs,
  statusFor,
} from "@/lib/mslq";
import { RadarChart } from "@/components/charts/RadarChart";
import { LineChart } from "@/components/charts/LineChart";
import { ApplicationsComparison, type ScoredApplication } from "@/components/ApplicationsComparison";

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
  const { id } = await params;
  const supabase = await createClient();

  const { data: student } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (!student) notFound();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("course_id, courses(limite)")
    .eq("student_id", id)
    .limit(1)
    .maybeSingle();
  const limite = (enrollment as unknown as { courses: { limite: number } | null } | null)?.courses?.limite ?? 4;

  const [{ data: questions }, { data: applications }, { data: recs }] = await Promise.all([
    supabase.from("mslq_questions").select("*"),
    supabase.from("mslq_applications").select("*").eq("student_id", id).order("applied_at", { ascending: true }),
    supabase.from("recommendations").select("*").eq("student_id", id).order("created_at", { ascending: false }),
  ]);

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
          <p>{student.email}</p>
        </div>
        <Link href={`/professor/enviar-sugestao?student_id=${student.id}`} className="btn btn-primary">
          ✉️ Enviar sugestão
        </Link>
      </div>

      {scoresByApplication.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📊</div>
          <p>Este aluno ainda não respondeu o questionário MSLQ.</p>
        </div>
      ) : (
        (() => {
          const last = scoresByApplication[scoresByApplication.length - 1];
          const labels = scoresByApplication.map((s) => fmtDate(s.application.applied_at));

          function lineData(constructs: typeof MOTIVACAO_CONSTRUCTS) {
            return {
              labels,
              datasets: constructs.map((c, i) => ({
                label: c.label,
                data: scoresByApplication.map((s) => Number((s.scores[c.constructo] ?? 0).toFixed(2))),
                borderColor: PALETTE[i % PALETTE.length],
                backgroundColor: PALETTE[i % PALETTE.length] + "22",
                tension: 0.35,
                pointRadius: 4,
              })),
            };
          }
          function radarData(constructs: typeof MOTIVACAO_CONSTRUCTS) {
            return {
              labels: constructs.map((c) => c.label),
              datasets: [
                {
                  label: "Perfil atual",
                  data: constructs.map((c) => Number((last.scores[c.constructo] ?? 0).toFixed(2))),
                  backgroundColor: "rgba(79,70,229,.18)",
                  borderColor: "#4F46E5",
                  pointBackgroundColor: "#4F46E5",
                },
              ],
            };
          }
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
              <div className="card mb-4">
                <div className="card-header"><h3>Evolução — Escalas de Motivação</h3></div>
                <div className="card-body"><div className="chart-container"><LineChart data={lineData(MOTIVACAO_CONSTRUCTS)} options={lineOptions} /></div></div>
              </div>
              <div className="grid-2 mb-4">
                <div className="card">
                  <div className="card-header"><h3>Perfil Atual — Motivação</h3></div>
                  <div className="card-body"><div className="chart-container"><RadarChart data={radarData(MOTIVACAO_CONSTRUCTS)} options={radarOptions} /></div></div>
                </div>
                <div className="card">
                  <div className="card-header"><h3>Perfil Atual — Estratégias</h3></div>
                  <div className="card-body"><div className="chart-container"><RadarChart data={radarData(ESTRATEGIA_CONSTRUCTS)} options={radarOptions} /></div></div>
                </div>
              </div>
              <div className="card mb-4">
                <div className="card-header"><h3>Evolução — Escalas de Estratégias de Aprendizagem</h3></div>
                <div className="card-body"><div className="chart-container"><LineChart data={lineData(ESTRATEGIA_CONSTRUCTS)} options={lineOptions} /></div></div>
              </div>

              <ApplicationsComparison studentId={student.id} scoresByApplication={scoresByApplication} />

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
