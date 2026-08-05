"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { STUDENT_SCOPES, TEACHER_SCOPES } from "@/lib/google/scopes";

type Role = "aluno" | "professor";

export default function LoginPage() {
  const [role, setRole] = useState<Role>("aluno");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const redirectTo = `${window.location.origin}/auth/callback?role=${role}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        scopes: role === "professor" ? TEACHER_SCOPES : STUDENT_SCOPES,
        queryParams:
          role === "professor"
            ? { access_type: "offline", prompt: "consent" }
            : undefined,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">📚</div>
          <h1>NeoAVA-ARA</h1>
          <p>Sistema de Autorregulação da Aprendizagem</p>
        </div>

        <div className="role-tabs">
          <button
            type="button"
            className={`role-tab ${role === "aluno" ? "active" : ""}`}
            onClick={() => setRole("aluno")}
          >
            👤 Aluno
          </button>
          <button
            type="button"
            className={`role-tab ${role === "professor" ? "active" : ""}`}
            onClick={() => setRole("professor")}
          >
            🎓 Professor
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Redirecionando…" : `Entrar como ${role === "aluno" ? "aluno" : "professor"} com Google`}
        </button>

        <p style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "var(--text-muted)" }}>
          Baseado na proposta de tese de Alana Neo · UFCG
        </p>
      </div>
    </div>
  );
}
