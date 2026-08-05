// Definições e cálculo de score dos 13 construtos do MSLQ.
// Textos de ajuda portados de pages/03_Perfil.py do Streamlit.

export interface ConstructDef {
  constructo: string;
  label: string;
  icon: string;
  help: string;
  /** true = pontuação ALTA é ruim (só se aplica a Ansiedade em Testes) */
  invertido?: boolean;
}

export const MOTIVACAO_CONSTRUCTS: ConstructDef[] = [
  {
    constructo: "Orientação a Metas Intrínsecas",
    label: "Orientação a Metas Intrínsecas",
    icon: "🎯",
    help: "Grau em que o aluno participa de uma tarefa por razões como desafio, curiosidade e domínio do conteúdo.",
  },
  {
    constructo: "Orientação a Metas Extrínsecas",
    label: "Orientação a Metas Extrínsecas",
    icon: "🏆",
    help: "Grau em que o aluno participa de uma tarefa por razões como notas, recompensas, desempenho e competição.",
  },
  {
    constructo: "Valorização da Atividade",
    label: "Valorização da Atividade",
    icon: "💡",
    help: "Avaliação do aluno sobre quão interessante, importante e útil é a atividade (diferente de por que ele participa dela).",
  },
  {
    constructo: "Controle do Aprendizado",
    label: "Controle do Aprendizado",
    icon: "🎛️",
    help: "Crença do aluno de que seus próprios esforços para aprender resultarão em resultados positivos.",
  },
  {
    constructo: "Autoeficácia para Aprendizado",
    label: "Autoeficácia para Aprendizado",
    icon: "💪",
    help: "Autoavaliação da capacidade de dominar o conteúdo e expectativa de bom desempenho na disciplina.",
  },
  {
    constructo: "Ansiedade em Testes",
    label: "Ansiedade em Testes",
    icon: "😰",
    help: "Quanto o aluno se preocupa com avaliações e se distrai durante uma prova. Ao contrário dos demais construtos, aqui pontuação ALTA indica mais ansiedade — não é um resultado positivo.",
    invertido: true,
  },
];

export const ESTRATEGIA_CONSTRUCTS: ConstructDef[] = [
  {
    constructo: "Ensaio (memorização)",
    label: "Ensaio (Memorização)",
    icon: "📝",
    help: "Uso de estratégias como releitura de anotações e memorização repetida de listas e conceitos-chave.",
  },
  {
    constructo: "Elaboração",
    label: "Elaboração",
    icon: "🔗",
    help: "Resumir ou parafrasear o conteúdo com as próprias palavras e relacioná-lo com o que já se sabe.",
  },
  {
    constructo: "Organização",
    label: "Organização",
    icon: "🗂️",
    help: "Capacidade de selecionar as ideias principais de um texto e organizar o que precisa ser aprendido.",
  },
  {
    constructo: "Pensamento Crítico",
    label: "Pensamento Crítico",
    icon: "🧩",
    help: "Colocar ideias importantes nas próprias palavras ao estudar, em vez de apenas memorizá-las.",
  },
  {
    constructo: "Autorregulação Metacognitiva",
    label: "Autorregulação Metacognitiva",
    icon: "🧠",
    help: "Frequência com que o aluno planeja, monitora e ajusta a própria leitura e estudo.",
  },
  {
    constructo: "Tempo e Ambiente de Estudo",
    label: "Tempo e Ambiente de Estudo",
    icon: "⏰",
    help: "Administração da agenda de estudo e uso de um ambiente adequado para concentração.",
  },
  {
    constructo: "Administração de Esforços",
    label: "Administração de Esforços",
    icon: "💪",
    help: "Disposição para persistir nas tarefas de estudo mesmo quando o material é difícil ou desinteressante.",
  },
];

export const ALL_CONSTRUCTS: ConstructDef[] = [...MOTIVACAO_CONSTRUCTS, ...ESTRATEGIA_CONSTRUCTS];

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
