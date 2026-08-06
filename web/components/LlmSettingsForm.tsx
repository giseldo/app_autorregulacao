"use client";

import { useActionState, useState } from "react";
import { saveLlmSettings, type LlmActionState } from "@/app/actions/llm";
import { LLM_PROVIDERS, type LlmProvider } from "@/lib/llmProviders";

export function LlmSettingsForm({
  initialProvider,
  initialModel,
  hasApiKey,
}: {
  initialProvider: LlmProvider;
  initialModel: string;
  hasApiKey: boolean;
}) {
  const [provider, setProvider] = useState<LlmProvider>(initialProvider);
  const [model, setModel] = useState(initialModel);
  const [state, formAction, pending] = useActionState<LlmActionState, FormData>(saveLlmSettings, undefined);

  const info = LLM_PROVIDERS[provider];
  const isPresetModel = info.models.some((m) => m.value === model);

  function handleProviderChange(p: LlmProvider) {
    setProvider(p);
    setModel(LLM_PROVIDERS[p].defaultModel);
  }

  return (
    <form action={formAction}>
      <div className="form-group">
        <label htmlFor="provider">Provedor</label>
        <select
          id="provider"
          name="provider"
          className="form-control"
          value={provider}
          onChange={(e) => handleProviderChange(e.target.value as LlmProvider)}
        >
          {Object.entries(LLM_PROVIDERS).map(([key, p]) => (
            <option key={key} value={key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="model-picker">Modelo</label>
        <select
          id="model-picker"
          className="form-control mb-2"
          value={isPresetModel ? model : "__custom__"}
          onChange={(e) => {
            if (e.target.value !== "__custom__") setModel(e.target.value);
          }}
        >
          {info.models.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
          <option value="__custom__">Outro (digitar manualmente)</option>
        </select>
        <input
          id="model"
          name="model"
          type="text"
          className="form-control"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder={`ex: ${info.defaultModel}`}
        />
      </div>

      <div className="form-group">
        <label htmlFor="api_key">
          Chave de API {info.label}
          {hasApiKey && <span className="text-xs text-muted"> — já configurada, deixe em branco para manter</span>}
        </label>
        <input
          id="api_key"
          name="api_key"
          type="password"
          className="form-control"
          autoComplete="off"
          placeholder={hasApiKey ? "•••••••••••• (mantida se deixado em branco)" : "cole sua chave aqui"}
        />
        <p className="text-xs text-muted mt-1">
          Crie a chave em{" "}
          <a href={info.keyHelpUrl} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
            {info.keyHelpUrl}
          </a>
          . Fica guardada só no servidor; esta tela nunca volta a mostrar o valor.
        </p>
      </div>

      {state?.error && (
        <div className="alert alert-danger mt-3">
          <span>⚠️</span>
          <div>{state.error}</div>
        </div>
      )}
      {state?.success && (
        <div className="alert alert-success mt-3">
          <span>✅</span>
          <div>{state.success}</div>
        </div>
      )}

      <button type="submit" className="btn btn-primary mt-3" disabled={pending || !model.trim()}>
        {pending ? "Salvando…" : "Salvar configuração"}
      </button>
    </form>
  );
}
