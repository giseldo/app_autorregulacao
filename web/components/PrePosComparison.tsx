import { ALL_CONSTRUCTS, type ConstructDef } from "@/lib/mslq";
import { RadarChart } from "@/components/charts/RadarChart";
import type { MslqApplication, MslqRound } from "@/lib/supabase/types";

export type RoundedApplication = { application: MslqApplication; scores: Record<string, number> };

const ROUND_LABEL: Record<MslqRound, string> = {
  pre: "Pré-teste",
  pos: "Pós-teste",
  extra: "3ª aplicação",
};
const ROUND_COLOR: Record<MslqRound, string> = {
  pre: "#94A3B8",
  pos: "#4F46E5",
  extra: "#10B981",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 * Coração do dashboard "antes × depois" da tese: mostra, para um mesmo aluno,
 * o perfil de autorregulação no pré-teste, pós-teste e (se houver) uma 3ª
 * aplicação, lado a lado — em vez da lista genérica de N aplicações em ordem
 * cronológica que ApplicationsComparison já cobre para quem usa o app avulso.
 */
export function PrePosComparison({ applications }: { applications: RoundedApplication[] }) {
  const rounds: MslqRound[] = ["pre", "pos", "extra"];
  const byRound = new Map<MslqRound, RoundedApplication>();
  for (const round of rounds) {
    const matches = applications.filter((a) => a.application.round === round);
    const last = matches[matches.length - 1];
    if (last) byRound.set(round, last);
  }

  const present = rounds.filter((r) => byRound.has(r));
  if (present.length === 0) return null;

  const radarData = {
    labels: ALL_CONSTRUCTS.map((c) => c.label),
    datasets: present.map((round) => {
      const entry = byRound.get(round)!;
      return {
        label: ROUND_LABEL[round],
        data: ALL_CONSTRUCTS.map((c) => Number((entry.scores[c.constructo] ?? 0).toFixed(2))),
        borderColor: ROUND_COLOR[round],
        backgroundColor: ROUND_COLOR[round] + "22",
        pointBackgroundColor: ROUND_COLOR[round],
      };
    }),
  };
  const radarOptions = {
    scales: { r: { min: 1, max: 7, ticks: { stepSize: 1, font: { size: 10 } } } },
    plugins: { legend: { position: "bottom" as const } },
  };

  const pairs: [MslqRound, MslqRound][] = [];
  for (let i = 1; i < present.length; i++) pairs.push([present[i - 1], present[i]]);

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Antes × Depois — Evolução da Autorregulação</h3>
        <span className="text-xs text-muted">
          {present.map((r) => `${ROUND_LABEL[r]} (${fmtDate(byRound.get(r)!.application.applied_at)})`).join(" · ")}
        </span>
      </div>
      <div className="card-body">
        <div className="chart-container mb-4">
          <RadarChart data={radarData} options={radarOptions} />
        </div>

        {pairs.map(([from, to]) => {
          const before = byRound.get(from)!;
          const after = byRound.get(to)!;
          const deltas = ALL_CONSTRUCTS.map((c) => {
            const b = before.scores[c.constructo];
            const a = after.scores[c.constructo];
            if (b == null || a == null) return null;
            const diff = a - b;
            const melhorou = c.invertido ? diff < 0 : diff > 0;
            const piorou = c.invertido ? diff > 0 : diff < 0;
            return { c, b, a, diff, melhorou, piorou };
          }).filter(
            (d): d is { c: ConstructDef; b: number; a: number; diff: number; melhorou: boolean; piorou: boolean } =>
              d !== null
          );

          return (
            <div key={`${from}-${to}`} className="mb-4">
              <div className="font-semibold text-sm mb-3">
                {ROUND_LABEL[from]} → {ROUND_LABEL[to]}
              </div>
              <div className="grid-2" style={{ gap: 4 }}>
                {deltas.map(({ c, b, a, diff, melhorou, piorou }) => (
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
                      {b.toFixed(1)} → {a.toFixed(1)} ({diff > 0 ? "+" : ""}
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
