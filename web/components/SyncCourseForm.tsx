"use client";

import { useActionState, useState, useTransition } from "react";
import { fetchGoogleCourses, syncCourse, type ActionState } from "@/app/actions/professor";

export function SyncCourseForm() {
  const [courses, setCourses] = useState<{ id: string; name: string }[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, startTransition] = useTransition();
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(syncCourse, undefined);

  function loadCourses() {
    startTransition(async () => {
      const res = await fetchGoogleCourses();
      if (res.error) {
        setLoadError(res.error);
        setCourses(null);
      } else {
        setLoadError(null);
        setCourses(res.courses ?? []);
      }
    });
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>Sincronizar turma do Google Classroom</h3>
      </div>
      <div className="card-body">
        {!courses && (
          <button type="button" className="btn btn-secondary" onClick={loadCourses} disabled={loading}>
            {loading ? "Carregando…" : "🔄 Carregar minhas turmas do Classroom"}
          </button>
        )}

        {loadError && (
          <div className="alert alert-danger mt-3">
            <span>⚠️</span>
            <div>{loadError}</div>
          </div>
        )}

        {courses && courses.length === 0 && (
          <div className="alert alert-warning mt-3">
            <span>⚠️</span>
            <div>Nenhuma turma ativa encontrada no seu Google Classroom.</div>
          </div>
        )}

        {courses && courses.length > 0 && (
          <form action={formAction} className="mt-3">
            <div className="form-group">
              <label htmlFor="course-select">Turma</label>
              <select
                id="course-select"
                className="form-control"
                defaultValue=""
                onChange={(e) => {
                  const c = courses.find((c) => c.id === e.target.value) ?? null;
                  setSelected(c);
                }}
              >
                <option value="" disabled>
                  Selecione…
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <input type="hidden" name="google_course_id" value={selected?.id ?? ""} />
            <input type="hidden" name="name" value={selected?.name ?? ""} />

            {state?.error && (
              <div className="alert alert-danger">
                <span>⚠️</span>
                <div>{state.error}</div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={!selected || pending}>
              {pending ? "Sincronizando…" : "Sincronizar turma e alunos"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
