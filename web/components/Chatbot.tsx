"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PromptMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const GREETING: Record<"aluno" | "professor", string> = {
  aluno: "Oi! 👋 Sou o assistente do NeoAVA-ARA. Posso te dar dicas de estudo e motivação. Como posso ajudar?",
  professor:
    "Olá! 👋 Sou o assistente do NeoAVA-ARA. Posso ajudar a interpretar os construtos do MSLQ e sugerir " +
    "recomendações para seus alunos. Como posso ajudar?",
};

export function Chatbot({ role }: { role: "aluno" | "professor" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: GREETING[role] }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastPrompt, setLastPrompt] = useState<PromptMessage[] | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    if (!open || lastPrompt) return;
    fetch("/api/chat")
      .then((res) => res.json())
      .then((json) => {
        if (json.systemPrompt) setLastPrompt([{ role: "system", content: json.systemPrompt }]);
      })
      .catch(() => {});
  }, [open, lastPrompt]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const json = await res.json();
      if (json.promptSent) setLastPrompt(json.promptSent);
      if (!res.ok) throw new Error(json.error ?? "Falha ao falar com o chatbot.");
      setMessages([...next, { role: "assistant", content: json.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao falar com o chatbot.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir chatbot"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--primary)",
          color: "#fff",
          border: "none",
          boxShadow: "var(--shadow-lg)",
          fontSize: 24,
          cursor: "pointer",
          zIndex: 900,
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 92,
            width: 340,
            maxWidth: "calc(100vw - 48px)",
            height: 460,
            maxHeight: "calc(100vh - 140px)",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 900,
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              background: "var(--primary)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span>🤖 Assistente NeoAVA-ARA</span>
            <button
              type="button"
              onClick={() => setShowPrompt((v) => !v)}
              title="Ver prompt enviado ao modelo"
              aria-label="Ver prompt enviado ao modelo"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.6)",
                borderRadius: 6,
                color: "#fff",
                fontSize: 11,
                padding: "2px 6px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {showPrompt ? "Ocultar prompt" : "Ver prompt"}
            </button>
          </div>

          {showPrompt && (
            <div
              style={{
                maxHeight: 160,
                overflowY: "auto",
                padding: 10,
                borderBottom: "1px solid var(--border)",
                background: "var(--bg)",
                fontFamily: "monospace",
                fontSize: 11,
                whiteSpace: "pre-wrap",
              }}
            >
              {lastPrompt ? (
                lastPrompt.map((m, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>
                    <strong>[{m.role}]</strong> {m.content}
                  </div>
                ))
              ) : (
                <div style={{ color: "var(--text-muted)" }}>Carregando prompt…</div>
              )}
            </div>
          )}

          <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? "var(--primary)" : "var(--bg)",
                  color: m.role === "user" ? "#fff" : "var(--text)",
                  padding: "8px 12px",
                  borderRadius: 12,
                  fontSize: 13,
                  maxWidth: "85%",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", fontSize: 13, color: "var(--text-muted)" }}>Digitando…</div>
            )}
            {error && (
              <div style={{ alignSelf: "flex-start", fontSize: 12, color: "var(--danger)" }}>{error}</div>
            )}
          </div>

          <div style={{ display: "flex", gap: 6, padding: 10, borderTop: "1px solid var(--border)" }}>
            <input
              className="form-control"
              style={{ fontSize: 13 }}
              placeholder="Escreva sua mensagem…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={loading}
            />
            <button type="button" className="btn btn-primary btn-sm" onClick={send} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
