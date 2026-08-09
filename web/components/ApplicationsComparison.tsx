import { createClient } from "@/lib/supabase/server";
import { ALL_CONSTRUCTS, type ConstructDef } from "@/lib/mslq";
import type { MslqApplication, Recommendation } from "@/lib/supabase/types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export type ScoredApplication = { application: MslqApplication; scores: Record<string, number> };

/**
 * Núcleo da pesquisa da tese: aplicação → recomendação → nova aplicação.
 * Mostra, para cada par de aplicações consecutivas do aluno, quais
 * recomendações foram enviadas no intervalo e se o construto associado
 * melhorou, piorou ou ficou igual.
 */
export async function ApplicationsComparison({
  studentId,
  rosterEmail,
  scoresByApplication,
}: {
  studentId: string | null;
  /** E-mail do aluno quando ele ainda não tem profile (dados importados). */
  rosterEmail?: string | null;
  scoresByApplication: ScoredApplication[];
}) {
  if (scoresByApplication.length < 2) return null;

  const supabase = await createClient();
  const { data: recs } = await supabase
    .from("recommendations")
    .select("*")
    .order("created_at", { ascending: true });

  const relevantRecs = (recs ?? []).filter(
    (r) =>
      (studentId !== null && r.student_id === studentId) ||
      (!!rosterEmail && r.roster_email === rosterEmail) ||
      r.student_id === null
  ) as Recommendation[];

  const pairs: [ScoredApplication, ScoredApplication][] = [];
  for (let i = 1; i < scoresByApplication.length; i++) {
    pairs.push([scoresByApplication[i - 1], scoresByApplication[i]]);
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Comparativo entre aplicações</h3>
        <span className="text-xs text-muted">antes/depois de cada recomendação</span>
      </div>
      <div className="card-body">
        {pairs.map(([prev, curr], idx) => {
          const between = relevantRecs.filter(
            (r) => r.created_at > prev.application.applied_at && r.created_at <= curr.application.applied_at
          );

          const deltas = ALL_CONSTRUCTS.map((c) => {
            const before = prev.scores[c.constructo];
            const after = curr.scores[c.constructo];
            if (before == null || after == null) return null;
            const diff = after - before;
            const melhorou = c.invertido ? diff < 0 : diff > 0;
            const piorou = c.invertido ? diff > 0 : diff < 0;
            return { c, before, after, diff, melhorou, piorou };
          }).filter((d): d is { c: ConstructDef; before: number; after: number; diff: number; melhorou: boolean; piorou: boolean } => d !== null);

          return (
            <div key={idx} className={idx < pairs.length - 1 ? "mb-6" : ""}>
              <div className="flex justify-between items-center mb-3">
                <div className="font-semibold text-sm">
                  {fmtDate(prev.application.applied_at)} → {fmtDate(curr.application.applied_at)}
                </div>
                {between.length > 0 && (
                  <span className="text-xs text-muted">
                    {between.length} recomendação(ões) enviada(s) no período
                  </span>
                )}
              </div>

              {between.length > 0 && (
                <div className="mb-3">
                  {between.map((r) => (
                    <div key={r.id} className="rec-card" style={{ marginBottom: 8 }}>
                      <div className="rec-header">
                        <span className={`rec-tag ${r.constructo ? "tag-motivacao" : "tag-geral"}`}>
                          {r.constructo ?? "Geral"}
                        </span>
                        <span className="rec-date">{fmtDate(r.created_at)}</span>
                      </div>
                      <div className="rec-title" style={{ fontSize: 13 }}>
                        {r.title}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid-2" style={{ gap: 4 }}>
                {deltas.map(({ c, before, after, diff, melhorou, piorou }) => (
                  <div
                    key={c.constructo}
                    className="flex items-center justify-between text-sm"
                    style={{ padding: "6px 0", borderBottom: "1px solid var(--border)" }}
                  >
                    <span>
                      {c.icon} {c.label}
                    </span>
                    <span
                      className={melhorou ? "delta-up" : piorou ? "delta-down" : "text-muted"}
                      style={{ fontWeight: 700 }}
                    >
                      {before.toFixed(1)} → {after.toFixed(1)} ({diff > 0 ? "+" : ""}
                      {diff.toFixed(1)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
