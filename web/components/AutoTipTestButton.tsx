"use client";

import { useActionState } from "react";
import { sendAutoTip, type ActionState } from "@/app/actions/professor";

export function AutoTipTestButton() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(sendAutoTip, undefined);

  return (
    <form action={formAction}>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Enviando…" : "🤖 Enviar dica automática de teste"}
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
