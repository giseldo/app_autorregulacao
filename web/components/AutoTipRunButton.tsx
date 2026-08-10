"use client";

import { useActionState } from "react";
import { runAutoTipNow, type ActionState } from "@/app/actions/professor";

export function AutoTipRunButton() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(runAutoTipNow, undefined);

  return (
    <form action={formAction}>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Analisando turma…" : "🤖 Rodar dica automática agora"}
      </button>
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
    </form>
  );
}
