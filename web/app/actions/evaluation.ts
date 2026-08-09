"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export type EvaluationFormState = { error?: string } | undefined;

const FIELDS = ["clareza", "satisfacao", "recomendaria", "resolveu_problema"] as const;

export async function submitRecommendationEvaluation(
  _prevState: EvaluationFormState,
  formData: FormData
): Promise<EvaluationFormState> {
  const { profile } = await requireProfile("aluno");
  const supabase = await createClient();

  const recommendationId = (formData.get("recommendation_id") as string) || "";
  if (!recommendationId) {
    return { error: "Recomendação inválida." };
  }

  const values: Record<(typeof FIELDS)[number], number> = {
    clareza: 0,
    satisfacao: 0,
    recomendaria: 0,
    resolveu_problema: 0,
  };
  for (const field of FIELDS) {
    const raw = formData.get(field);
    const v = raw ? Number(raw) : NaN;
    if (!Number.isFinite(v) || v < 1 || v > 7) {
      return { error: "Responda as 4 perguntas antes de enviar." };
    }
    values[field] = v;
  }

  const { error } = await supabase.from("recommendation_evaluations").upsert(
    { recommendation_id: recommendationId, student_id: profile.id, ...values },
    { onConflict: "recommendation_id,student_id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/aluno/sugestoes");
  return undefined;
}
