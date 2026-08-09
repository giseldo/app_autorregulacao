"use client";

import { useActionState, useState } from "react";
import { submitRecommendationEvaluation, type EvaluationFormState } from "@/app/actions/evaluation";

const SCALE = [1, 2, 3, 4, 5, 6, 7];

const QUESTIONS = [
  { key: "clareza", label: "A recomendação foi clara?" },
  { key: "satisfacao", label: "Sua satisfação geral com a recomendação" },
  { key: "recomendaria", label: "Você recomendaria essa dica a um colega?" },
  { key: "resolveu_problema", label: "Ela ajudou a resolver a dificuldade?" },
] as const;

export function RecommendationEvaluationForm({ recommendationId }: { recommendationId: string }) {
  const [state, formAction, pending] = useActionState<EvaluationFormState, FormData>(
    submitRecommendationEvaluation,
    undefined
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const completo = QUESTIONS.every((q) => answers[q.key] != null);

  return (
    <form action={formAction} className="mt-3" style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
      <input type="hidden" name="recommendation_id" value={recommendationId} />
      <div className="text-xs text-muted mb-2">
        Avalie esta recomendação (1 = discordo totalmente · 7 = concordo totalmente)
      </div>
      {QUESTIONS.map((q) => (
        <div key={q.key} className="construct-item">
          <div className="text-sm" style={{ marginBottom: 6 }}>
            {q.label}
          </div>
          <div className="likert-scale">
            {SCALE.map((v) => (
              <button
                key={v}
                type="button"
                className={`likert-btn ${answers[q.key] === v ? "selected" : ""}`}
                onClick={() => setAnswers((prev) => ({ ...prev, [q.key]: v }))}
              >
                {v}
              </button>
            ))}
          </div>
          <input type="hidden" name={q.key} value={answers[q.key] ?? ""} />
        </div>
      ))}
      {state?.error && (
        <div className="alert alert-danger" style={{ marginBottom: 12 }}>
          <span>⚠️</span>
          <div>{state.error}</div>
        </div>
      )}
      <button type="submit" className="btn btn-primary btn-sm" disabled={!completo || pending}>
        {pending ? "Enviando…" : "Enviar avaliação"}
      </button>
    </form>
  );
}
