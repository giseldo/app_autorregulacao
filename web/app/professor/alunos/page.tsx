import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getActiveCourse, getCourseOverview } from "@/lib/professorData";
import { ALL_CONSTRUCTS } from "@/lib/mslq";

function initialsOf(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export default async function AlunosPage() {
  const { profile } = await requireProfile("professor");
  const course = await getActiveCourse(profile.id);

  if (!course) {
    return (
      <>
        <div className="page-header">
          <h2>Alunos 👥</h2>
        </div>
        <div className="empty-state">
          <div className="icon">🏫</div>
          <p>
            Sincronize uma turma em{" "}
            <Link href="/professor/turma" style={{ color: "var(--primary)" }}>
              Turma
            </Link>{" "}
            para ver os alunos aqui.
          </p>
        </div>
      </>
    );
  }

  const { students } = await getCourseOverview(course.id);

  return (
    <>
      <div className="page-header">
        <h2>Alunos 👥</h2>
        <p>Perfil de autorregulação de cada aluno com base na aplicação mais recente do MSLQ.</p>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0, overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Aplicações</th>
                {ALL_CONSTRUCTS.map((c) => (
                  <th key={c.constructo} title={c.label}>
                    {c.icon}
                  </th>
                ))}
                <th>Média</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const score = s.overallScore;
                const avgCls = score == null ? "score-low" : score >= course.limite ? "score-high" : "score-low";
                return (
                  <tr key={s.email} style={s.profile ? undefined : { opacity: 0.7 }}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar avatar-student" style={{ width: 28, height: 28, fontSize: 11 }}>
                          {initialsOf(s.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{s.name}</div>
                          <div className="text-xs text-muted">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{s.applicationsCount}</td>
                    {ALL_CONSTRUCTS.map((c) => {
                      const v = s.latest?.scores[c.constructo];
                      if (v == null) return <td key={c.constructo} className="text-muted">—</td>;
                      const cls = v >= course.limite ? "score-high" : "score-low";
                      return (
                        <td key={c.constructo}>
                          <span className={`score-badge ${cls}`}>{v.toFixed(1)}</span>
                        </td>
                      );
                    })}
                    <td>
                      <span className={`score-badge ${avgCls}`}>{score != null ? score.toFixed(1) : "—"}</span>
                    </td>
                    <td>
                      {!s.profile ? (
                        <span className="score-badge score-low">Sem login</span>
                      ) : score == null ? (
                        <span className="score-badge score-low">Sem dados</span>
                      ) : score < course.limite ? (
                        <span className="score-badge score-low">⚠️ Em risco</span>
                      ) : (
                        <span className="score-badge score-high">✅ OK</span>
                      )}
                    </td>
                    <td>
                      {s.profile ? (
                        <div className="flex gap-2">
                          <Link href={`/professor/alunos/${s.profile.id}`} className="btn btn-secondary btn-sm">
                            Ver
                          </Link>
                          <Link
                            href={`/professor/enviar-sugestao?student_id=${s.profile.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            Sugestão
                          </Link>
                        </div>
                      ) : (
                        <span className="text-xs text-muted">Aguardando 1º login</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
