// Funções estatísticas puras (sem dependência de Supabase/Next) — extraídas
// de app/actions/evaluation.ts para poderem ser testadas isoladamente.

/** Alfa de Cronbach padrão (k itens, variância amostral) a partir da matriz
 * linhas=respondentes, colunas=itens. null se não houver dado suficiente
 * (n < 2 ou k < 2) ou variância total zero (nenhuma diferença entre respostas). */
export function cronbachAlpha(matrix: number[][]): number | null {
  const n = matrix.length;
  const k = matrix[0]?.length ?? 0;
  if (n < 2 || k < 2) return null;

  const itemVariances = Array.from({ length: k }, (_, j) => {
    const col = matrix.map((row) => row[j]);
    const mean = col.reduce((a, b) => a + b, 0) / n;
    return col.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
  });
  const totals = matrix.map((row) => row.reduce((a, b) => a + b, 0));
  const totalMean = totals.reduce((a, b) => a + b, 0) / n;
  const totalVariance = totals.reduce((a, b) => a + (b - totalMean) ** 2, 0) / (n - 1);
  if (totalVariance === 0) return null;

  const sumItemVar = itemVariances.reduce((a, b) => a + b, 0);
  return (k / (k - 1)) * (1 - sumItemVar / totalVariance);
}

/** Mediana de uma lista de números; null para lista vazia. */
export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
