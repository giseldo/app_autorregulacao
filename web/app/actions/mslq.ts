"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export type MslqFormState = { error?: string } | undefined;

export async function submitMslqApplication(
  _prevState: MslqFormState,
  formData: FormData
): Promise<MslqFormState> {
  const { profile } = await requireProfile("aluno");
  const supabase = await createClient();

  const label = ((formData.get("label") as string) || "").trim() || null;

  const { data: questions, error: questionsError } = await supabase
    .from("mslq_questions")
    .select("id_questao");

  if (questionsError || !questions || questions.length === 0) {
    return { error: "Não foi possível carregar o banco de questões. Tente novamente." };
  }

  const answers: { id_questao: string; valor: number }[] = [];
  for (const q of questions) {
    const raw = formData.get(`q_${q.id_questao}`);
    const valor = raw ? Number(raw) : NaN;
    if (!Number.isFinite(valor) || valor < 1 || valor > 7) {
      return { error: "Responda todas as 44 perguntas antes de enviar." };
    }
    answers.push({ id_questao: q.id_questao, valor });
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("student_id", profile.id)
    .limit(1)
    .maybeSingle();

  const { data: application, error: appError } = await supabase
    .from("mslq_applications")
    .insert({ student_id: profile.id, course_id: enrollment?.course_id ?? null, label })
    .select("id")
    .single();

  if (appError || !application) {
    return { error: appError?.message ?? "Falha ao salvar a aplicação do questionário." };
  }

  const { error: answersError } = await supabase
    .from("mslq_answers")
    .insert(answers.map((a) => ({ application_id: application.id, ...a })));

  if (answersError) {
    return { error: answersError.message };
  }

  redirect("/aluno/historico?enviado=1");
}
