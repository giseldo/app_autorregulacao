import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getActiveCourse, getCourseOverview } from "@/lib/professorData";
import { ALL_CONSTRUCTS, MOTIVACAO_CONSTRUCTS, ESTRATEGIA_CONSTRUCTS } from "@/lib/mslq";
import { RadarChart } from "@/components/charts/RadarChart";
import { BarChart } from "@/components/charts/BarChart";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function initialsOf(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export default async function DashboardPage() {
  const { profile } = await requireProfile("professor");
  const course = await getActiveCourse(profile.id);

  if (!course) {
    return (
      <>
        <div className="page-header">
          <h2>Dashboard do Professor 📊</h2>
          <p>Monitoramento da autorregulação da aprendizagem em tempo real.</p>
        </div>
        <div className="empty-state">
          <div className="icon">🏫</div>
          <p>
            Nenhuma turma sincronizada ainda. Vá em{" "}
            <Link href="/professor/turma" style={{ color: "var(--primary)" }}>
              Turma
            </Link>{" "}
            para importar sua turma do Google Classroom.
          </p>
        </div>
      </>
    );
  }

  const { students } = await getCourseOverview(course.id);
  const withData = students.filter((s) => s.latest !== null);
  const avgAll = withData.length
    ? withData.reduce((acc, s) => acc + (s.overallScore ?? 0), 0) / withData.length
    : 0;
  const atRisk = withData.filter((s) => (s.overallScore ?? 0) < course.limite);

  function radarData(constructs: typeof MOTIVACAO_CONSTRUCTS) {
    return {
      labels: constructs.map((c) => c.label),
      datasets: [
        {
          label: "Turma",
          data: constructs.map((c) => {
            const vals = withData
              .map((s) => s.latest?.scores[c.constructo])
              .filter((v): v is number => v != null);
            return vals.length ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)) : 0;
          }),
          backgroundColor: "rgba(16,185,129,.18)",
          borderColor: "#10B981",
          pointBackgroundColor: "#10B981",
        },
      ],
    };
  }

  const barData = {
    labels: ALL_CONSTRUCTS.map((c) => `${c.icon} ${c.label}`),
    datasets: [
      {
        label: "Média da turma",
        data: ALL_CONSTRUCTS.map((c) => {
          const vals = withData
            .map((s) => s.latest?.scores[c.constructo])
            .filter((v): v is number => v != null);
          return vals.length ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)) : 0;
        }),
        backgroundColor: "#4F46E5CC",
        borderRadius: 6,
      },
    ],
  };

  const radarOptions = {
    scales: { r: { min: 1, max: 7, ticks: { stepSize: 1, font: { size: 10 } } } },
    plugins: { legend: { display: false } },
  };
  const barOptions = {
    indexAxis: "y" as const,
    scales: { x: { min: 1, max: 7, ticks: { stepSize: 1 } } },
    plugins: { legend: { display: false } },
  };

  return (
    <>
      <div className="page-header">
        <h2>Dashboard do Professor 📊</h2>
        <p>
          Turma: <strong>{course.name}</strong> — monitoramento da autorregulação da aprendizagem (MSLQ).
        </p>
      </div>

      <div className="grid-4 mb-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#EEF2FF" }}>👥</div>
          <div className="stat-content">
            <div className="label">Alunos</div>
            <div className="value">{students.length}</div>
            <div className="delta delta-up">{withData.length} com questionário respondido</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#ECFDF5" }}>📈</div>
          <div className="stat-content">
            <div className="label">Média Geral MSLQ</div>
            <div className="value">{avgAll.toFixed(1)}</div>
            <div className={`delta ${avgAll >= course.limite ? "delta-up" : "delta-down"}`}>
              {avgAll >= course.limite ? "Satisfatório" : "Abaixo do esperado"}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#FEF2F2" }}>⚠️</div>
          <div className="stat-content">
            <div className="label">Em risco</div>
            <div className="value" style={{ color: atRisk.length > 0 ? "var(--danger)" : "var(--secondary)" }}>
              {atRisk.length}
            </div>
            <div className={`delta ${atRisk.length > 0 ? "delta-down" : "delta-up"}`}>
              {atRisk.length > 0 ? "Precisam de atenção" : "Todos satisfatórios"}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#FFFBEB" }}>✉️</div>
          <div className="stat-content">
            <div className="label">Limite configurado</div>
            <div className="value">{course.limite}</div>
            <div className="delta text-muted">ajuste em Turma</div>
          </div>
        </div>
      </div>

      {atRisk.length > 0 && (
        <div className="alert alert-warning mb-4">
          <span>⚠️</span>
          <div>
            <strong>Alunos que precisam de atenção:</strong> {atRisk.map((s) => s.name).join(", ")}.
            Considere enviar sugestões personalizadas.
          </div>
        </div>
      )}

      <div className="grid-2 mb-4">
        <div className="card">
          <div className="card-header">
            <h3>Radar MSLQ — Motivação (turma)</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <RadarChart data={radarData(MOTIVACAO_CONSTRUCTS)} options={radarOptions} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Alunos</h3>
            <Link href="/professor/enviar-sugestao" className="btn btn-primary btn-sm">
              + Sugestão
            </Link>
          </div>
          <div className="card-body" style={{ padding: 14 }}>
            {students.length === 0 && <p className="text-sm text-muted">Nenhum aluno matriculado ainda.</p>}
            {students.map((s) => {
              const score = s.overallScore;
              const cls = score == null ? "score-low" : score >= course.limite ? "score-high" : "score-low";
              const content = (
                <>
                  <div className="avatar avatar-student" style={{ width: 30, height: 30, fontSize: 11 }}>
                    {initialsOf(s.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="font-semibold text-sm">{s.name}</div>
                    <div className="text-xs text-muted">
                      {s.profile
                        ? `${s.applicationsCount} aplicação(ões)${s.latest ? ` · ${fmtDate(s.latest.application.applied_at)}` : ""}`
                        : "Aguardando 1º login no app"}
                    </div>
                  </div>
                  <span className={`score-badge ${cls}`}>{score != null ? score.toFixed(1) : "—"}</span>
                </>
              );
              return s.profile ? (
                <Link
                  key={s.email}
                  href={`/professor/alunos/${s.profile.id}`}
                  className={`student-mini ${score != null && score < course.limite ? "at-risk" : ""}`}
                >
                  {content}
                </Link>
              ) : (
                <div key={s.email} className="student-mini" style={{ cursor: "default", opacity: 0.7 }}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3>Radar MSLQ — Estratégias de Aprendizagem (turma)</h3>
        </div>
        <div className="card-body">
          <div className="chart-container">
            <RadarChart data={radarData(ESTRATEGIA_CONSTRUCTS)} options={radarOptions} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Médias por construto — turma (últimas aplicações)</h3>
        </div>
        <div className="card-body">
          <div className="chart-container" style={{ height: 420 }}>
            <BarChart data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </>
  );
}
