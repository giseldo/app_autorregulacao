import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getCourseOverview, getRecommendationEvaluationsRaw } from "@/lib/professorData";
import { ALL_CONSTRUCTS } from "@/lib/mslq";

/** Export XLSX (scores por aluno + avaliações de recomendação) da turma
 * informada em ?course_id — só a turma do próprio professor logado. */
export async function GET(request: Request) {
  const { profile } = await requireProfile("professor");
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("course_id") ?? "";

  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .eq("teacher_id", profile.id)
    .maybeSingle();

  if (!course) {
    return NextResponse.json({ error: "Turma não encontrada." }, { status: 404 });
  }

  const [{ students }, evaluations] = await Promise.all([
    getCourseOverview(course.id),
    getRecommendationEvaluationsRaw(course.id),
  ]);

  const alunosSheet = students.map((s) => {
    const row: Record<string, string | number> = {
      Nome: s.name,
      Email: s.email,
      "Aplicações": s.applicationsCount,
    };
    for (const c of ALL_CONSTRUCTS) {
      const v = s.latest?.scores[c.constructo];
      row[c.label] = v != null ? Number(v.toFixed(2)) : "";
    }
    row["Média geral"] = s.overallScore != null ? Number(s.overallScore.toFixed(2)) : "";
    row["Média pré-teste"] = s.byRound.pre ? Number(s.byRound.pre.overallScore.toFixed(2)) : "";
    row["Média pós-teste"] = s.byRound.pos ? Number(s.byRound.pos.overallScore.toFixed(2)) : "";
    return row;
  });

  const avaliacoesSheet = evaluations.map((e) => ({
    Aluno: e.studentName,
    Email: e.studentEmail,
    Construto: e.constructo ?? "",
    "Recomendação": e.title,
    Clareza: e.clareza,
    "Satisfação": e.satisfacao,
    Recomendaria: e.recomendaria,
    "Resolveu o problema": e.resolveu_problema,
    Data: e.created_at,
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(alunosSheet), "Alunos");
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      avaliacoesSheet.length > 0 ? avaliacoesSheet : [{ Aviso: "Nenhuma avaliação recebida ainda." }]
    ),
    "Avaliacoes"
  );

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
  const filename = `${course.name.replace(/[^a-z0-9]+/gi, "_")}_neoava.xlsx`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
