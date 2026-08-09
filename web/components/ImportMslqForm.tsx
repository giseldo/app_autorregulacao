"use client";

import { useActionState } from "react";
import { importMslqSpreadsheet, type ImportMslqState } from "@/app/actions/importMslq";

const ROUNDS = [
  { value: "pre", label: "Pré-teste" },
  { value: "pos", label: "Pós-teste" },
  { value: "extra", label: "3ª aplicação" },
];

export function ImportMslqForm() {
  const [state, formAction, pending] = useActionState<ImportMslqState, FormData>(
    importMslqSpreadsheet,
    undefined
  );

  return (
    <div className="card">
      <div className="card-header">
        <h3>Importar respostas do Google Forms</h3>
      </div>
      <div className="card-body">
        <p className="text-sm text-muted mb-3">
          Exporte as respostas do formulário como .xlsx e envie aqui. As colunas são identificadas pelo texto
          da pergunta (não pela posição), então funciona mesmo que a planilha tenha colunas extras antes ou
          depois das 34 perguntas do instrumento.
        </p>
        <form action={formAction}>
          <div className="form-group">
            <label htmlFor="round">Rodada</label>
            <select id="round" name="round" className="form-control" defaultValue="pre">
              {ROUNDS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="file">Arquivo (.xlsx)</label>
            <input id="file" name="file" type="file" accept=".xlsx" className="form-control" required />
          </div>

          {state?.error && (
            <div className="alert alert-danger">
              <span>⚠️</span>
              <div>{state.error}</div>
            </div>
          )}

          {state?.result && (
            <div className={`alert ${state.result.errors.length > 0 ? "alert-warning" : "alert-info"}`}>
              <span>{state.result.errors.length > 0 ? "⚠️" : "✅"}</span>
              <div>
                {state.result.imported} aplicação(ões) importada(s), {state.result.skipped} já existiam e
                foram puladas.
                {state.result.errors.length > 0 && (
                  <ul style={{ marginTop: 6 }}>
                    {state.result.errors.slice(0, 10).map((e, i) => (
                      <li key={i} className="text-xs">
                        {e}
                      </li>
                    ))}
                    {state.result.errors.length > 10 && (
                      <li className="text-xs">…e mais {state.result.errors.length - 10} erro(s).</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Importando…" : "📥 Importar"}
          </button>
        </form>
      </div>
    </div>
  );
}
