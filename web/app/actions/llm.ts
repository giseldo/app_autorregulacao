"use server";

import { requireProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isLlmProvider } from "@/lib/llmProviders";

export type LlmActionState = { error?: string; success?: string } | undefined;

export async function saveLlmSettings(_prev: LlmActionState, formData: FormData): Promise<LlmActionState> {
  const { profile } = await requireProfile("professor");

  const provider = (formData.get("provider") as string) || "";
  const model = ((formData.get("model") as string) || "").trim();
  const apiKeyInput = ((formData.get("api_key") as string) || "").trim();

  if (!isLlmProvider(provider)) return { error: "Escolha um provedor válido." };
  if (!model) return { error: "Informe um modelo." };

  const admin = createAdminClient();

  // Campo de chave em branco = manter a chave já salva (não sobrescreve com "").
  let apiKey: string | null | undefined;
  if (apiKeyInput) {
    apiKey = apiKeyInput;
  } else {
    const { data: existing } = await admin.from("llm_settings").select("api_key").eq("id", true).maybeSingle();
    apiKey = existing?.api_key ?? null;
  }

  const { error } = await admin.from("llm_settings").upsert(
    {
      id: true,
      provider,
      model,
      api_key: apiKey,
      updated_at: new Date().toISOString(),
      updated_by: profile.id,
    },
    { onConflict: "id" }
  );

  if (error) return { error: error.message };
  return { success: "Configuração do chatbot salva." };
}
