// Metadados dos provedores de LLM suportados pelo chatbot — sem segredos,
// então esse módulo pode ser importado tanto no server (lib/llm.ts) quanto
// direto em componentes client (o formulário de Configurações).
export type LlmProvider = "groq" | "deepseek";

export interface LlmModelOption {
  value: string;
  label: string;
}

export interface LlmProviderInfo {
  label: string;
  baseUrl: string;
  defaultModel: string;
  models: LlmModelOption[];
  keyHelpUrl: string;
}

export const LLM_PROVIDERS: Record<LlmProvider, LlmProviderInfo> = {
  groq: {
    label: "Groq",
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    defaultModel: "llama-3.3-70b-versatile",
    models: [
      { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile" },
      { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant" },
      { value: "deepseek-r1-distill-llama-70b", label: "DeepSeek R1 Distill Llama 70B (via Groq)" },
      { value: "gemma2-9b-it", label: "Gemma 2 9B IT" },
    ],
    keyHelpUrl: "https://console.groq.com/keys",
  },
  deepseek: {
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com/chat/completions",
    defaultModel: "deepseek-chat",
    models: [
      { value: "deepseek-chat", label: "DeepSeek Chat (V3)" },
      { value: "deepseek-reasoner", label: "DeepSeek Reasoner (R1)" },
    ],
    keyHelpUrl: "https://platform.deepseek.com/api_keys",
  },
};

export const DEFAULT_LLM_PROVIDER: LlmProvider = "groq";

export function isLlmProvider(value: string): value is LlmProvider {
  return value === "groq" || value === "deepseek";
}
