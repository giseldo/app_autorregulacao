"use client";

import { useActionState, useMemo, useState } from "react";
import { submitMslqApplication, type MslqFormState } from "@/app/actions/mslq";
import { ALL_CONSTRUCTS, type ConstructDef } from "@/lib/mslq";
import type { MslqQuestion } from "@/lib/supabase/types";

const SCALE = [1, 2, 3, 4, 5, 6, 7];

function groupByConstruct(questions: MslqQuestion[]) {
  const map = new Map<string, MslqQuestion[]>();
  for (const q of questions) {
    const list = map.get(q.constructo) ?? [];
    list.push(q);
    map.set(q.constructo, list);
  }
  return map;
}

function Section({
  title,
  constructs,
  grouped,
  answers,
  onPick,
}: {
  title: string;
  constructs: ConstructDef[];
  grouped: Map<string, MslqQuestion[]>;
  answers: Record<string, number>;
  onPick: (id: string, v: number) => void;
}) {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>{title}</h3>
        <span className="text-xs text-muted">1 = Discordo totalmente · 7 = Concordo totalmente</span>
      </div>
      <div className="card-body">
        {constructs.map((c) => {
          const questions = grouped.get(c.constructo) ?? [];
          if (questions.length === 0) return null;
          return (
            <div key={c.constructo} className="mb-6">
              <div className="construct-header" style={{ marginBottom: 4 }}>
                <div className="construct-name">
                  {c.icon} {c.label}
                </div>
              </div>
              <div className="text-xs text-muted mb-3">{c.help}</div>
              {questions.map((q) => (
                <div key={q.id_questao} className="construct-item">
                  <div className="text-sm" style={{ marginBottom: 6 }}>
                    {q.dsc_questao}
                  </div>
                  <div className="likert-scale">
                    {SCALE.map((v) => (
                      <button
                        key={v}
                        type="button"
                        className={`likert-btn ${answers[q.id_questao] === v ? "selected" : ""}`}
                        onClick={() => onPick(q.id_questao, v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <div className="likert-labels">
                    <span>Discordo totalmente</span>
                    <span>Concordo totalmente</span>
                  </div>
                  <input type="hidden" name={`q_${q.id_questao}`} value={answers[q.id_questao] ?? ""} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MslqForm({ questions }: { questions: MslqQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [state, formAction, pending] = useActionState<MslqFormState, FormData>(
    submitMslqApplication,
    undefined
  );

  const grouped = useMemo(() => groupByConstruct(questions), [questions]);

  const totalRespondidas = Object.keys(answers).length;
  const completo = totalRespondidas === questions.length;

  function onPick(id: string, v: number) {
    setAnswers((prev) => ({ ...prev, [id]: v }));
  }

  return (
    <form action={formAction}>
      <div className="alert alert-info">
        <span>💡</span>
        <div>
          Responda as {questions.length} perguntas com sinceridade — não existem respostas certas ou
          erradas. Você pode responder este questionário mais de uma vez ao longo do período (por
          exemplo, antes e depois de receber uma recomendação do professor).
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="label">Rótulo desta aplicação (opcional)</label>
            <input
              id="label"
              name="label"
              className="form-control"
              placeholder="Ex: Antes da recomendação de gestão do tempo"
            />
          </div>
        </div>
      </div>

      <Section
        title="Perfil de Autorregulação da Aprendizagem"
        constructs={ALL_CONSTRUCTS.filter((c) => grouped.has(c.constructo))}
        grouped={grouped}
        answers={answers}
        onPick={onPick}
      />

      {state?.error && (
        <div className="alert alert-danger">
          <span>⚠️</span>
          <div>{state.error}</div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={!completo || pending}>
          {pending ? "Enviando…" : "💾 Enviar respostas"}
        </button>
        <span className="text-sm text-muted">
          {totalRespondidas}/{questions.length} respondidas
        </span>
      </div>
    </form>
  );
}
