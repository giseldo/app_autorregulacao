import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import {
  getActiveCourse,
  getCourseOverview,
  getRecommendationsSummary,
  getRecommendationEvaluationSummary,
} from "@/lib/professorData";
import { ALL_CONSTRUCTS } from "@/lib/mslq";
import { BarChart } from "@/components/charts/BarChart";

function avg(values: (number | null | undefined)[]): number {
  const nums = values.filter((v): v is number => v != null);
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

export default async function DashboardConsolidadoPage() {
  const { profile } = await requireProfile("professor");
  const course = await getActiveCourse(profile.id);

  if (!course) {
    return (
      <>
        <div className="page-header">
          <h2>Dashboard Consolidado 🧭</h2>
          <p>Visão consolidada do questionário de autorregulação e das recomendações enviadas.</p>
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

  const [{ students }, recs, evalSummary] = await Promise.all([
    getCourseOverview(course.id),
    getRecommendationsSummary(course.id),
    getRecommendationEvaluationSummary(course.id),
  ]);

  const preStudents = students.filter((s) => s.byRound.pre);
  const posStudents = students.filter((s) => s.byRound.pos);
  const pairStudents = students.filter((s) => s.byRound.pre && s.byRound.pos);

  const prePosBarData = {
    labels: ALL_CONSTRUCTS.map((c) => `${c.icon} ${c.label}`),
    datasets: [
      {
        label: "Pré-teste",
        data: ALL_CONSTRUCTS.map((c) =>
          Number(avg(pairStudents.map((s) => s.byRound.pre!.scores[c.constructo])).toFixed(2))
        ),
        backgroundColor: "#94A3B8CC",
        borderRadius: 6,
      },
      {
        label: "Pós-teste",
        data: ALL_CONSTRUCTS.map((c) =>
          Number(avg(pairStudents.map((s) => s.byRound.pos!.scores[c.constructo])).toFixed(2))
        ),
        backgroundColor: "#4F46E5CC",
        borderRadius: 6,
      },
    ],
  };
  const prePosBarOptions = {
    indexAxis: "y" as const,
    scales: { x: { min: 1, max: 7, ticks: { stepSize: 1 } } },
    plugins: { legend: { position: "bottom" as const } },
  };

  // Necessidade inicial mais comum: construto com mais alunos abaixo do limite no pré-teste.
  const necessidadeRanking = ALL_CONSTRUCTS.map((c) => {
    const vals = preStudents.map((s) => s.byRound.pre!.scores[c.constructo]).filter((v): v is number => v != null);
    const below = vals.filter((v) => v < course.limite).length;
    return { construct: c, below, total: vals.length };
  }).sort((a, b) => b.below - a.below);
  const necessidade = necessidadeRanking[0];

  // Construto que mais variou (em módulo) entre pré e pós, entre os pares analisados.
  const deltaRanking = ALL_CONSTRUCTS.map((c) => {
    const diffs = pairStudents
      .map((s) => {
        const pre = s.byRound.pre!.scores[c.constructo];
        const pos = s.byRound.pos!.scores[c.constructo];
        return pre != null && pos != null ? pos - pre : null;
      })
      .filter((v): v is number => v != null);
    const meanDiff = diffs.length ? diffs.reduce((a, b) => a + b, 0) / diffs.length : 0;
    return { construct: c, meanDiff, n: diffs.length };
  }).sort((a, b) => Math.abs(b.meanDiff) - Math.abs(a.meanDiff));
  const maiorVariacao = deltaRanking[0];

  const THRESHOLD = 0.05;
  const overallDiffs = pairStudents.map((s) => s.byRound.pos!.overallScore - s.byRound.pre!.overallScore);
  const melhoraram = overallDiffs.filter((d) => d > THRESHOLD).length;
  const pioraram = overallDiffs.filter((d) => d < -THRESHOLD).length;
  const estaveis = overallDiffs.length - melhoraram - pioraram;

  const recByConstructMax = Math.max(1, ...recs.byConstruct.map((r) => r.count));

  return (
    <>
      <div className="page-header flex items-center justify-between" style={{ flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2>Dashboard Consolidado 🧭</h2>
          <p>
            Turma: <strong>{course.name}</strong> — questionário de autorregulação (pré/pós) e recomendações
            enviadas, em um único painel.
          </p>
        </div>
        <a href={`/api/professor/export?course_id=${course.id}`} className="btn btn-secondary btn-sm">
          ⬇️ Exportar XLSX
        </a>
      </div>

      <div className="grid-4 mb-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#EEF2FF" }}>📝</div>
          <div className="stat-content">
            <div className="label">Respostas válidas — pré</div>
            <div className="value">{preStudents.length}</div>
            <div className="delta text-muted">de {students.length} aluno(s) matriculado(s)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#ECFDF5" }}>✅</div>
          <div className="stat-content">
            <div className="label">Respostas válidas — pós</div>
            <div className="value">{posStudents.length}</div>
            <div className="delta text-muted">de {students.length} aluno(s) matriculado(s)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#F5F3FF" }}>🔗</div>
          <div className="stat-content">
            <div className="label">Pares analisados</div>
            <div className="value">{pairStudents.length}</div>
            <div className="delta text-muted">aluno(s) com pré e pós</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#FFFBEB" }}>✉️</div>
          <div className="stat-content">
            <div className="label">Sugestões enviadas</div>
            <div className="value">{recs.total}</div>
            <div className="delta text-muted">
              {recs.personalizadas} personalizada(s) · {recs.controle} turma toda
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2 mb-4">
        <div className="card">
          <div className="card-header">
            <h3>Perfil médio de autorregulação</h3>
            <span className="text-xs text-muted">pares pré × pós · escala de 1 a 7</span>
          </div>
          <div className="card-body">
            {pairStudents.length === 0 ? (
              <p className="text-sm text-muted">
                Ainda não há alunos com pré-teste e pós-teste registrados para comparar.
              </p>
            ) : (
              <div className="chart-container" style={{ height: 320 }}>
                <BarChart data={prePosBarData} options={prePosBarOptions} />
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Avaliação das recomendações</h3>
            <span className="text-xs text-muted">{evalSummary.count} avaliação(ões) recebida(s)</span>
          </div>
          <div className="card-body">
            {evalSummary.count === 0 || evalSummary.overallAvg == null ? (
              <p className="text-sm text-muted">
                Nenhum aluno avaliou uma recomendação ainda. A avaliação fica disponível para o aluno em{" "}
                <strong>Sugestões Recebidas</strong>, logo abaixo de cada recomendação.
              </p>
            ) : (
              <>
                <div style={{ fontSize: 34, fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
                  {evalSummary.overallAvg.toFixed(2)}{" "}
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-muted)" }}>/ 7</span>
                </div>
                <div className="progress-bar" style={{ marginTop: 12, marginBottom: 10 }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${(evalSummary.overallAvg / 7) * 100}%`, background: "var(--secondary)" }}
                  />
                </div>
                <p className="text-sm text-muted" style={{ marginBottom: 16 }}>
                  <strong>{Math.round((evalSummary.favorablePct ?? 0) * 100)}%</strong> das respostas foram
                  favoráveis (5 a 7).
                </p>

                <div className="grid-2" style={{ gap: 12, marginBottom: 16 }}>
                  <div className="stat-card" style={{ padding: "12px 14px", boxShadow: "none", background: "var(--bg)" }}>
                    <div className="stat-content">
                      <div className="label">Consistência interna</div>
                      <div className="value" style={{ fontSize: 17 }}>
                        {evalSummary.cronbachAlpha != null ? `α = ${evalSummary.cronbachAlpha.toFixed(3)}` : "—"}
                      </div>
                    </div>
                  </div>
                  <div className="stat-card" style={{ padding: "12px 14px", boxShadow: "none", background: "var(--bg)" }}>
                    <div className="stat-content">
                      <div className="label">Mediana geral</div>
                      <div className="value" style={{ fontSize: 17 }}>{evalSummary.medianOverall?.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {evalSummary.items.map((it) => (
                  <div className="construct-item" key={it.key}>
                    <div className="construct-header">
                      <span className="construct-name">{it.label}</span>
                      <span className="construct-desc">{it.avg.toFixed(2)}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(it.avg / 7) * 100}%`, background: "var(--primary)" }} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3>Recomendações por construto</h3>
          <span className="text-xs text-muted">{recs.total} enviada(s) no total</span>
        </div>
        <div className="card-body">
          {recs.total === 0 ? (
            <p className="text-sm text-muted">Nenhuma recomendação enviada nesta turma ainda.</p>
          ) : (
            recs.byConstruct.map(({ constructo, count }) => {
              const def = ALL_CONSTRUCTS.find((c) => c.constructo === constructo)!;
              const pct = Math.round((count / recByConstructMax) * 100);
              return (
                <div className="construct-item" key={constructo}>
                  <div className="construct-header">
                    <span className="construct-name">
                      {def.icon} {def.label}
                    </span>
                    <span className="construct-desc">{count}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: "var(--primary)" }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid-3">
        <div className="card" style={{ borderLeft: "4px solid var(--secondary)" }}>
          <div className="card-body">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Principal necessidade inicial</h3>
            {necessidade && necessidade.total > 0 ? (
              <>
                <span className="rec-tag" style={{ background: "#d1fae5", color: "#065f46" }}>
                  {necessidade.construct.icon} {necessidade.construct.label}
                </span>
                <p className="text-sm text-muted" style={{ marginTop: 12 }}>
                  {necessidade.below} de {necessidade.total} aluno(s) (
                  {Math.round((necessidade.below / necessidade.total) * 100)}%) apresentaram escore abaixo do limite
                  configurado ({course.limite}) no pré-teste — maior proporção entre os {ALL_CONSTRUCTS.length}{" "}
                  construtos.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted">Ainda não há respostas de pré-teste para calcular.</p>
            )}
          </div>
        </div>

        <div className="card" style={{ borderLeft: "4px solid var(--primary)" }}>
          <div className="card-body">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Comparação pré × pós</h3>
            {pairStudents.length > 0 ? (
              <p className="text-sm text-muted">
                Nos {pairStudents.length} par(es) analisados: 🔺 {melhoraram} melhoraram, 🔻 {pioraram} pioraram, ▪️{" "}
                {estaveis} estável(is) (média geral). O construto com maior variação foi{" "}
                <strong>{maiorVariacao.construct.label}</strong> (Δ = {maiorVariacao.meanDiff > 0 ? "+" : ""}
                {maiorVariacao.meanDiff.toFixed(2)}, n={maiorVariacao.n}).
              </p>
            ) : (
              <p className="text-sm text-muted">Ainda não há pares pré/pós suficientes para comparar.</p>
            )}
          </div>
        </div>

        <div className="card" style={{ borderLeft: "4px solid var(--warning)" }}>
          <div className="card-body">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Leitura metodológica</h3>
            <span className="rec-tag" style={{ background: "#fffbeb", color: "#92400e" }}>
              Resultado exploratório
            </span>
            <p className="text-sm text-muted" style={{ marginTop: 12 }}>
              A comparação pré × pós acima é descritiva: o app não calcula teste de significância estatística (ex.
              correção de Holm) nem usa grupo de controle randomizado. Evite inferência causal a partir desses
              números — apenas a avaliação das recomendações (α de Cronbach) usa um teste estatístico real.
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted mt-4">
        Dados agregados da turma sincronizada via Google Classroom. Fonte: NeoAVA-ARA.
      </p>
    </>
  );
}
