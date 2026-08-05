import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getActiveCourse } from "@/lib/professorData";
import { getCourseInteraction } from "@/lib/interactionData";
import { GoogleTokenMissingError } from "@/lib/google/classroom";
import { BarChart } from "@/components/charts/BarChart";

function fmtDate(iso: string | null) {
  if (!iso) return "sem prazo";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function rateColor(rate: number) {
  if (rate >= 0.7) return "var(--secondary)";
  if (rate >= 0.4) return "#F59E0B";
  return "var(--danger)";
}

export default async function DashboardInteracaoPage() {
  const { profile } = await requireProfile("professor");
  const course = await getActiveCourse(profile.id);

  if (!course) {
    return (
      <>
        <div className="page-header">
          <h2>Dashboard Interação 🤝</h2>
        </div>
        <div className="empty-state">
          <div className="icon">🏫</div>
          <p>
            Sincronize uma turma em{" "}
            <Link href="/professor/turma" style={{ color: "var(--primary)" }}>
              Turma
            </Link>{" "}
            antes de ver a interação no Google Classroom.
          </p>
        </div>
      </>
    );
  }

  let data;
  let errorMessage: string | null = null;
  try {
    data = await getCourseInteraction(profile.id, course.id, course.google_course_id);
  } catch (e) {
    errorMessage =
      e instanceof GoogleTokenMissingError
        ? e.message
        : "Não foi possível ler os dados do Google Classroom: " +
          (e instanceof Error ? e.message : "erro desconhecido") +
          " — se você logou antes desta função existir, saia e entre novamente como professor para autorizar o novo escopo de leitura de atividades.";
  }

  return (
    <>
      <div className="page-header">
        <h2>Dashboard Interação 🤝</h2>
        <p>
          Turma: <strong>{course.name}</strong> — atividades, entregas e avisos direto do Google Classroom.
        </p>
      </div>

      {errorMessage && (
        <div className="alert alert-danger mb-4">
          <span>⚠️</span>
          <div>{errorMessage}</div>
        </div>
      )}

      {data && (
        <>
          <div className="grid-4 mb-4">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#EEF2FF" }}>📝</div>
              <div className="stat-content">
                <div className="label">Atividades publicadas</div>
                <div className="value">{data.totalAssignments}</div>
                <div className="delta text-muted">courseWork no Classroom</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#F5F3FF" }}>📣</div>
              <div className="stat-content">
                <div className="label">Avisos publicados</div>
                <div className="value">{data.totalAnnouncements}</div>
                <div className="delta text-muted">announcements no Classroom</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#ECFDF5" }}>📈</div>
              <div className="stat-content">
                <div className="label">Taxa de entrega geral</div>
                <div className="value">{(data.submissionRate * 100).toFixed(0)}%</div>
                <div className={`delta ${data.submissionRate >= 0.7 ? "delta-up" : "delta-down"}`}>
                  {data.turnedInCount} de {data.totalSubmissions} entregas
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#FEF2F2" }}>⏰</div>
              <div className="stat-content">
                <div className="label">Entregas atrasadas</div>
                <div className="value" style={{ color: data.lateCount > 0 ? "var(--danger)" : "var(--secondary)" }}>
                  {data.lateCount}
                </div>
                <div className="delta text-muted">late = true no Classroom</div>
              </div>
            </div>
          </div>

          {data.assignments.length === 0 ? (
            <div className="empty-state mb-4">
              <div className="icon">📝</div>
              <p>Nenhuma atividade (courseWork) publicada nesta turma ainda.</p>
            </div>
          ) : (
            <>
              <div className="card mb-4">
                <div className="card-header">
                  <h3>Taxa de entrega por atividade</h3>
                </div>
                <div className="card-body">
                  <div className="chart-container" style={{ height: Math.max(220, data.assignments.length * 34) }}>
                    <BarChart
                      data={{
                        labels: data.assignments.map((a) => a.title),
                        datasets: [
                          {
                            label: "% entregue",
                            data: data.assignments.map((a) => Number((a.rate * 100).toFixed(0))),
                            backgroundColor: "#4F46E5CC",
                            borderRadius: 6,
                          },
                        ],
                      }}
                      options={{
                        indexAxis: "y" as const,
                        scales: { x: { min: 0, max: 100, ticks: { stepSize: 20 } } },
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-header">
                  <h3>Atividades</h3>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Prazo</th>
                        <th>Entregues</th>
                        <th>% entrega</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.assignments.map((a) => (
                        <tr key={a.id}>
                          <td>
                            {a.alternateLink ? (
                              <a href={a.alternateLink} target="_blank" rel="noreferrer" style={{ color: "var(--primary)" }}>
                                {a.title}
                              </a>
                            ) : (
                              a.title
                            )}
                          </td>
                          <td>{fmtDate(a.dueDate)}</td>
                          <td>
                            {a.turnedIn}/{a.total}
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div className="progress-bar" style={{ width: 80 }}>
                                <div
                                  className="progress-fill"
                                  style={{ width: `${(a.rate * 100).toFixed(0)}%`, background: rateColor(a.rate) }}
                                />
                              </div>
                              <span className="text-xs text-muted">{(a.rate * 100).toFixed(0)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <div className="card">
            <div className="card-header">
              <h3>Interação por aluno</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {data.students.length === 0 ? (
                <p className="text-sm text-muted" style={{ padding: 14 }}>
                  Nenhum aluno sincronizado nesta turma ainda.
                </p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Aluno</th>
                      <th>Entregues</th>
                      <th>Pendentes</th>
                      <th>Atrasos</th>
                      <th>Nota média</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.students.map((s) => (
                      <tr key={s.email}>
                        <td>{s.name}</td>
                        <td>{s.turnedIn}</td>
                        <td>{s.pending}</td>
                        <td>
                          {s.late > 0 ? (
                            <span className="score-badge score-low">{s.late}</span>
                          ) : (
                            <span className="text-muted">0</span>
                          )}
                        </td>
                        <td>{s.avgGrade != null ? s.avgGrade : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
