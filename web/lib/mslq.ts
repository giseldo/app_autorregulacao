// Definições e cálculo de score dos 6 construtos do instrumento de
// autorregulação usado no experimento (34 itens — ver migration
// 0008_construct_model_autorregulacao.sql). Nenhum item deste instrumento é
// de pontuação invertida.

export interface ConstructDef {
  constructo: string;
  label: string;
  icon: string;
  help: string;
  /** true = pontuação ALTA é ruim. Nenhum construto deste instrumento é invertido. */
  invertido?: boolean;
}

export const ALL_CONSTRUCTS: ConstructDef[] = [
  {
    constructo: "Motivação",
    label: "Motivação",
    icon: "🎯",
    help: "Confiança e disposição do aluno para concluir as atividades da disciplina e definir metas de estudo.",
  },
  {
    constructo: "Metacognição",
    label: "Metacognição",
    icon: "🧠",
    help: "Frequência com que o aluno planeja, monitora a própria compreensão e ajusta a forma de estudar.",
  },
  {
    constructo: "Estratégias de Aprendizado",
    label: "Estratégias de Aprendizado",
    icon: "📚",
    help: "Uso de resumos, mapas mentais, diferentes recursos e revisão regular do material estudado.",
  },
  {
    constructo: "Autocontrole Emocional",
    label: "Autocontrole Emocional",
    icon: "😌",
    help: "Capacidade de gerenciar estresse, manter a calma e lidar com frustração diante de dificuldades.",
  },
  {
    constructo: "Ambiente de Estudo",
    label: "Ambiente de Estudo",
    icon: "🏡",
    help: "Organização do ambiente, cronograma e materiais de estudo, e busca de ajuda quando necessário.",
  },
  {
    constructo: "Autonomia e Autodisciplina",
    label: "Autonomia e Autodisciplina",
    icon: "💪",
    help: "Responsabilidade do aluno pelo próprio progresso: decidir, avaliar e ajustar seu processo de aprendizagem.",
  },
];

export function constructDef(constructo: string): ConstructDef | undefined {
  return ALL_CONSTRUCTS.find((c) => c.constructo === constructo);
}

/**
 * Calcula a média por construto a partir das respostas de UMA aplicação.
 * Itens marcados `reversa` são invertidos (8 - valor) antes de entrar na média,
 * seguindo a pontuação padrão do MSLQ (escala 1-7). Ver nota em
 * supabase/migrations/0003_seed_mslq_questions.sql sobre a diferença em
 * relação ao app Streamlit original, que não invertia esses itens.
 */
export function scoreConstructs(
  questions: { id_questao: string; constructo: string; reversa: boolean }[],
  answers: Record<string, number>
): Record<string, number> {
  const acc: Record<string, { total: number; count: number }> = {};
  for (const q of questions) {
    const raw = answers[q.id_questao];
    if (raw == null) continue;
    const valor = q.reversa ? 8 - raw : raw;
    const bucket = (acc[q.constructo] ??= { total: 0, count: 0 });
    bucket.total += valor;
    bucket.count += 1;
  }
  const result: Record<string, number> = {};
  for (const [constructo, { total, count }] of Object.entries(acc)) {
    result[constructo] = count ? total / count : 0;
  }
  return result;
}

/** Réplica o critério do Streamlit: score >= limite é "alto"; para o construto
 * invertido (Ansiedade), o sentido bom/ruim é trocado. */
export function statusFor(score: number, limite: number, invertido = false): "high" | "low" {
  const acimaDoLimite = score >= limite;
  if (invertido) return acimaDoLimite ? "low" : "high";
  return acimaDoLimite ? "high" : "low";
}
