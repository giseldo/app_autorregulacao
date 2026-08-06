import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { LLM_PROVIDERS, DEFAULT_LLM_PROVIDER, isLlmProvider, type LlmProvider } from "@/lib/llmProviders";

export class LlmNotConfiguredError extends Error {
  constructor() {
    super("Chatbot indisponível: nenhuma chave de API configurada em Configurações.");
  }
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface InternalSettings {
  provider: LlmProvider;
  model: string;
  apiKey: string | null;
}

async function getInternalSettings(): Promise<InternalSettings> {
  const admin = createAdminClient();
  const { data } = await admin.from("llm_settings").select("*").eq("id", true).maybeSingle();

  const provider = data?.provider && isLlmProvider(data.provider) ? data.provider : DEFAULT_LLM_PROVIDER;

  return {
    provider,
    model: data?.model || LLM_PROVIDERS[provider].defaultModel,
    // Fallback pro env var antigo (GROQ_API_KEY) enquanto ninguém salvou uma
    // chave pela tela de Configurações ainda — mantém quem já tinha configurado
    // via .env funcionando sem quebrar.
    apiKey: data?.api_key || (provider === "groq" ? process.env.GROQ_API_KEY ?? null : null),
  };
}

/** Campos seguros pra exibir na tela de Configurações — nunca inclui a api_key. */
export async function getLlmSettingsPublic(): Promise<{
  provider: LlmProvider;
  model: string;
  hasApiKey: boolean;
}> {
  const { provider, model, apiKey } = await getInternalSettings();
  return { provider, model, hasApiKey: !!apiKey };
}

export async function chatWithLlm(messages: ChatMessage[]): Promise<string> {
  const { provider, model, apiKey } = await getInternalSettings();
  if (!apiKey) throw new LlmNotConfiguredError();

  const info = LLM_PROVIDERS[provider];
  const res = await fetch(info.baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, temperature: 0.5, max_tokens: 600 }),
  });

  if (!res.ok) {
    throw new Error(`Erro na API da ${info.label} (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content?.trim() ?? "Não consegui gerar uma resposta agora.";
}
