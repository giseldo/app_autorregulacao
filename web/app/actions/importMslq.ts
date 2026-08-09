"use server";

import * as XLSX from "xlsx";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveCourse } from "@/lib/professorData";
import type { MslqQuestion, MslqRound } from "@/lib/supabase/types";

export type ImportMslqState =
  | {
      error?: string;
      result?: { imported: number; skipped: number; errors: string[] };
    }
  | undefined;

const COMBINING_MARKS = new RegExp("[̀-ͯ]", "g");

function normalize(s: unknown): string {
  return String(s ?? "")
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const ROUND_LABEL: Record<MslqRound, string> = {
  pre: "Pré-teste",
  pos: "Pós-teste",
  extra: "3ª aplicação",
};

export async function importMslqSpreadsheet(
  _prev: ImportMslqState,
  formData: FormData
): Promise<ImportMslqState> {
  const { profile } = await requireProfile("professor");
  const course = await getActiveCourse(profile.id);
  if (!course) {
    return { error: "Sincronize uma turma antes de importar respostas." };
  }

  const round = formData.get("round") as MslqRound | null;
  if (!round || !["pre", "pos", "extra"].includes(round)) {
    return { error: "Selecione a rodada (pré-teste, pós-teste ou 3ª aplicação)." };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Selecione um arquivo .xlsx exportado do Google Forms." };
  }

  const supabase = await createClient();
  const { data: questions } = await supabase
    .from("mslq_questions")
    .select("*")
    .order("ordem", { ascending: true });

  if (!questions || questions.length === 0) {
    return { error: "Não foi possível carregar o banco de questões." };
  }

  let rows: unknown[][];
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null }) as unknown[][];
  } catch {
    return { error: "Não foi possível ler o arquivo. Confirme que é um .xlsx válido." };
  }

  if (rows.length < 2) {
    return { error: "A planilha não tem linhas de resposta." };
  }

  const header = rows[0];
  const normalizedHeader = header.map((h) => normalize(h));

  const emailCol = normalizedHeader.findIndex((h) => h.includes("mail"));
  const nameCol = normalizedHeader.findIndex((h) => h.includes("nome"));
  const timestampCol = normalizedHeader.findIndex((h) => h.includes("carimbo") || h.includes("data/hora"));

  if (emailCol === -1) {
    return { error: "Não encontrei a coluna de e-mail na planilha." };
  }

  const questionCol = new Map<string, number>(); // id_questao -> column index
  const missing: string[] = [];
  for (const q of questions as MslqQuestion[]) {
    const target = normalize(q.dsc_questao);
    const col = normalizedHeader.findIndex((h) => h === target);
    if (col === -1) {
      missing.push(q.dsc_questao);
    } else {
      questionCol.set(q.id_questao, col);
    }
  }

  if (missing.length > 0) {
    return {
      error:
        `${missing.length} pergunta(s) do banco não foram encontradas nos cabeçalhos da planilha ` +
        `(confira se é a planilha certa): ${missing.slice(0, 3).join(" / ")}${missing.length > 3 ? "…" : ""}`,
    };
  }

  const admin = createAdminClient();

  const { data: existingApps } = await admin
    .from("mslq_applications")
    .select("student_id, roster_email")
    .eq("course_id", course.id)
    .eq("round", round);

  const seen = new Set(
    (existingApps ?? []).map((a) => (a.student_id ? `s:${a.student_id}` : `e:${a.roster_email}`))
  );

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every((c) => c == null || c === "")) continue;

    const email = String(row[emailCol] ?? "").trim();
    if (!email) continue;

    const name = nameCol !== -1 ? String(row[nameCol] ?? "").trim() || email : email;
    const appliedAt = timestampCol !== -1 && row[timestampCol] instanceof Date
      ? (row[timestampCol] as Date).toISOString()
      : new Date().toISOString();

    const answers: { id_questao: string; valor: number }[] = [];
    let rowError: string | null = null;
    for (const [id_questao, col] of questionCol) {
      const valor = Number(row[col]);
      if (!Number.isFinite(valor) || valor < 1 || valor > 7) {
        rowError = `linha ${i + 1} (${email}): resposta inválida em "${id_questao}".`;
        break;
      }
      answers.push({ id_questao, valor });
    }
    if (rowError) {
      errors.push(rowError);
      continue;
    }

    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .eq("role", "aluno")
      .maybeSingle();

    const studentId = existingProfile?.id ?? null;
    const identity = studentId ? `s:${studentId}` : `e:${email}`;
    if (seen.has(identity)) {
      skipped++;
      continue;
    }

    const { data: application, error: appError } = await admin
      .from("mslq_applications")
      .insert({
        student_id: studentId,
        course_id: course.id,
        roster_email: studentId ? null : email,
        roster_name: studentId ? null : name,
        round,
        label: ROUND_LABEL[round],
        applied_at: appliedAt,
      })
      .select("id")
      .single();

    if (appError || !application) {
      errors.push(`linha ${i + 1} (${email}): ${appError?.message ?? "falha ao salvar a aplicação."}`);
      continue;
    }

    const { error: answersError } = await admin
      .from("mslq_answers")
      .insert(answers.map((a) => ({ application_id: application.id, ...a })));

    if (answersError) {
      errors.push(`linha ${i + 1} (${email}): ${answersError.message}`);
      continue;
    }

    seen.add(identity);
    imported++;
  }

  return { result: { imported, skipped, errors } };
}
