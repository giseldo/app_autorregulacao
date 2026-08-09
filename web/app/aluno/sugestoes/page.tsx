import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const TAG_MOTIVACAO = new Set(["Motivação", "Autocontrole Emocional"]);

function tagClassFor(constructo: string | null) {
  if (!constructo) return "tag-geral";
  if (TAG_MOTIVACAO.has(constructo)) return "tag-motivacao";
  return "tag-estrategia";
}

export default async function SugestoesPage() {
  const { profile } = await requireProfile("aluno");
  const supabase = await createClient();

  const { data: recs } = await supabase
    .from("recommendations")
    .select("*")
    .order("created_at", { ascending: false });

  const list = recs ?? [];

  // marca como lidas ao abrir a página (mesmo comportamento do protótipo estático)
  if (list.length > 0) {
    await supabase.from("recommendation_reads").upsert(
      list.map((r) => ({ recommendation_id: r.id, student_id: profile.id })),
      { onConflict: "recommendation_id,student_id", ignoreDuplicates: true }
    );
  }

  return (
    <>
      <div className="page-header">
        <h2>Sugestões Recebidas 💡</h2>
        <p>Estratégias personalizadas de autorregulação da aprendizagem enviadas pelo professor.</p>
      </div>

      {list.length === 0 ? (
        <div className="empty-state">
          <div className="icon">💌</div>
          <p>Nenhuma sugestão ainda. Responda o questionário para que o professor possa acompanhar seu perfil.</p>
        </div>
      ) : (
        list.map((r) => (
          <div key={r.id} className="rec-card">
            <div className="rec-header">
              <span className={`rec-tag ${tagClassFor(r.constructo)}`}>{r.constructo ?? "Geral"}</span>
              <span className="rec-date">{fmtDate(r.created_at)}</span>
            </div>
            <div className="rec-title">{r.title}</div>
            <div className="rec-content">{r.content}</div>
            <div className="flex gap-2 mt-3">
              {r.student_id === null && <span className="text-xs text-muted">📢 Enviado para toda a turma</span>}
              {r.auto && <span className="text-xs text-muted">🤖 Sugestão automática</span>}
            </div>
          </div>
        ))
      )}
    </>
  );
}
