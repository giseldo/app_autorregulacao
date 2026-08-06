import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chatWithLlm, LlmNotConfiguredError, type ChatMessage } from "@/lib/llm";

const SYSTEM_PROMPT: Record<"aluno" | "professor", string> = {
  aluno:
    "Você é o assistente do NeoAVA-ARA, um app de autorregulação da aprendizagem baseado no " +
    "questionário MSLQ (Motivated Strategies for Learning Questionnaire). Ajude o estudante com " +
    "dicas práticas e curtas de motivação e estratégias de estudo (gestão de tempo, ansiedade em " +
    "provas, organização, elaboração, pensamento crítico, etc). Seja acolhedor, direto e responda " +
    "em português do Brasil, em poucos parágrafos.",
  professor:
    "Você é o assistente do NeoAVA-ARA para professores, um app de autorregulação da aprendizagem " +
    "baseado no MSLQ (13 construtos de motivação e estratégias de aprendizagem). Ajude o professor a " +
    "interpretar os dados do dashboard da turma, sugerir recomendações para alunos com construtos " +
    "baixos e explicar os construtos do MSLQ quando perguntado. Responda em português do Brasil, de " +
    "forma objetiva.",
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role, name").eq("id", user.id).single();
  if (!profile?.role) return NextResponse.json({ error: "Perfil não encontrado." }, { status: 401 });

  const { messages } = (await request.json()) as { messages: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
  }

  try {
    const reply = await chatWithLlm([
      { role: "system", content: SYSTEM_PROMPT[profile.role as "aluno" | "professor"] },
      ...messages.slice(-12),
    ]);
    return NextResponse.json({ reply });
  } catch (e) {
    const status = e instanceof LlmNotConfiguredError ? 503 : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro desconhecido." }, { status });
  }
}
