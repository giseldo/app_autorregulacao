"use client";

import { useActionState, useState } from "react";
import { sendRecommendation, type ActionState } from "@/app/actions/professor";
import type { RecommendationTemplate } from "@/lib/supabase/types";

export interface StudentOption {
  id: string;
  name: string;
  email: string;
  overallScore: number | null;
  lowConstructs: string[];
  hasLogin: boolean;
}

export function SendRecommendationForm({
  courseId,
  students,
  templates,
  defaultStudentId,
  limite,
}: {
  courseId: string;
  students: StudentOption[];
  templates: RecommendationTemplate[];
  defaultStudentId?: string;
  limite: number;
}) {
  const [target, setTarget] = useState(defaultStudentId ?? "");
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [constructo, setConstructo] = useState("");
  const [state, formAction, pending] = useActionState<ActionState, FormData>(sendRecommendation, undefined);

  const selectedStudent = students.find((s) => s.id === target) ?? null;

  function applyTemplate(t: RecommendationTemplate) {
    setTemplateId(t.id);
    setTitle(`Dica: ${t.constructo_grupo}`);
    setContent(t.texto);
    setConstructo(t.constructo_grupo);
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="course_id" value={courseId} />
      <input type="hidden" name="student_id" value={target} />
      <input type="hidden" name="constructo" value={constructo} />

      <div className="grid-2">
        <div>
          <div className="card mb-4">
            <div className="card-header">
              <h3>1. Destinatário</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="target">Enviar para</label>
                <select
                  id="target"
                  className="form-control"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                >
                  <option value="">📢 Todos os alunos da turma</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.hasLogin ? s.name : `⏳ ${s.name} (ainda não logou)`}
                    </option>
                  ))}
                </select>
              </div>

              {!target && (
                <div className="alert alert-info">
                  <span>📢</span>
                  <div>Esta sugestão será publicada para toda a turma no Google Classroom.</div>
                </div>
              )}

              {target && selectedStudent && (
                <div className={`alert ${(selectedStudent.overallScore ?? 0) < limite ? "alert-warning" : "alert-success"}`}>
                  <span>{(selectedStudent.overallScore ?? 0) < limite ? "⚠️" : "✅"}</span>
                  <div>
                    <strong>{selectedStudent.name}</strong> — Média geral:{" "}
                    {selectedStudent.overallScore != null ? selectedStudent.overallScore.toFixed(1) : "sem dados"}
                    /7
                    <br />
                    <span className="text-xs">
                      {selectedStudent.hasLogin
                        ? selectedStudent.lowConstructs.length > 0
                          ? `Baixos: ${selectedStudent.lowConstructs.join(", ")}`
                          : "Todos os construtos satisfatórios."
                        : "⏳ Ainda não logou no app — sem dados do questionário, mas a sugestão é publicada no Classroom normalmente."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>2. Modelo de recomendação (opcional)</h3>
            </div>
            <div className="card-body">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="rec-card"
                  style={{ cursor: "pointer", marginBottom: 8, borderColor: templateId === t.id ? "var(--primary)" : undefined }}
                  onClick={() => applyTemplate(t)}
                >
                  <div className="rec-title" style={{ fontSize: 13 }}>
                    {t.constructo_grupo}
                  </div>
                  <div className="rec-content text-xs">{t.texto.slice(0, 110)}…</div>
                </div>
              ))}
              <p className="text-xs text-muted mt-3">Clique em um modelo para preencher a mensagem automaticamente.</p>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-header">
              <h3>3. Mensagem</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="title">Título</label>
                <input
                  id="title"
                  name="title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Dica para gerenciar melhor o tempo"
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Conteúdo</label>
                <textarea
                  id="content"
                  name="content"
                  className="form-control"
                  style={{ minHeight: 180 }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva aqui sua sugestão personalizada…"
                />
              </div>

              {state?.error && (
                <div className="alert alert-danger">
                  <span>⚠️</span>
                  <div>{state.error}</div>
                </div>
              )}
              {state?.success && (
                <div className="alert alert-success">
                  <span>✅</span>
                  <div>{state.success}</div>
                </div>
              )}

              <button type="submit" className="btn btn-success" disabled={pending || !title.trim() || !content.trim()}>
                {pending ? "Enviando…" : "✉️ Enviar sugestão"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
