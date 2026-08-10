"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ALL_CONSTRUCTS } from "@/lib/mslq";
import type { StudentOverview } from "@/lib/professorData";

const PAGE_SIZE = 20;

function initialsOf(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export function AlunosTable({ students, limite }: { students: StudentOverview[]; limite: number }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter((s) => s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term));
  }, [students, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageStudents = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(0);
  }

  return (
    <div className="card">
      <div className="card-body" style={{ padding: 14 }}>
        <input
          type="search"
          className="form-control"
          placeholder="Buscar aluno por nome ou e-mail…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>
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
              <th title="Variação entre pré-teste e pós-teste">Evolução</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pageStudents.length === 0 && (
              <tr>
                <td colSpan={ALL_CONSTRUCTS.length + 5} className="text-sm text-muted" style={{ padding: 20 }}>
                  Nenhum aluno encontrado para &quot;{search}&quot;.
                </td>
              </tr>
            )}
            {pageStudents.map((s) => {
              const score = s.overallScore;
              const avgCls = score == null ? "score-low" : score >= limite ? "score-high" : "score-low";
              const bothRounds = s.byRound.pre && s.byRound.pos;
              const diff = bothRounds ? s.byRound.pos!.overallScore - s.byRound.pre!.overallScore : null;
              return (
                <tr key={s.email} style={s.profile || s.applicationsCount > 0 ? undefined : { opacity: 0.7 }}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar avatar-student" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {initialsOf(s.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {s.name}
                          {!s.profile && <span className="text-xs text-muted"> ⏳</span>}
                        </div>
                        <div className="text-xs text-muted">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{s.applicationsCount}</td>
                  {ALL_CONSTRUCTS.map((c) => {
                    const v = s.latest?.scores[c.constructo];
                    if (v == null) return <td key={c.constructo} className="text-muted">—</td>;
                    const cls = v >= limite ? "score-high" : "score-low";
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
                    {score == null ? (
                      <span className="score-badge score-low">Sem dados</span>
                    ) : score < limite ? (
                      <span className="score-badge score-low">⚠️ Em risco</span>
                    ) : (
                      <span className="score-badge score-high">✅ OK</span>
                    )}
                  </td>
                  <td>
                    {diff == null ? (
                      <span className="text-xs text-muted">—</span>
                    ) : (
                      <span
                        className={diff > 0.05 ? "delta-up" : diff < -0.05 ? "delta-down" : "text-muted"}
                        style={{ fontWeight: 700, fontSize: 12 }}
                      >
                        {diff > 0.05 ? "🔺" : diff < -0.05 ? "🔻" : "▪️"} {diff > 0 ? "+" : ""}
                        {diff.toFixed(1)}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link
                        href={`/professor/alunos/${s.profile ? s.profile.id : `email:${encodeURIComponent(s.email)}`}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/professor/enviar-sugestao?student_id=${
                          s.profile ? s.profile.id : `email:${encodeURIComponent(s.email)}`
                        }`}
                        className="btn btn-primary btn-sm"
                      >
                        Sugestão
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="card-body flex items-center justify-between" style={{ paddingTop: 10, paddingBottom: 10 }}>
          <span className="text-xs text-muted">
            {filtered.length} aluno(s) · página {safePage + 1} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
            >
              ← Anterior
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage(safePage + 1)}
            >
              Próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
