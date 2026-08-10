import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getActiveCourse, getCourseOverview } from "@/lib/professorData";
import { AlunosTable } from "@/components/AlunosTable";

export default async function AlunosPage() {
  const { profile } = await requireProfile("professor");
  const course = await getActiveCourse(profile.id);

  if (!course) {
    return (
      <>
        <div className="page-header">
          <h2>Alunos 👥</h2>
        </div>
        <div className="empty-state">
          <div className="icon">🏫</div>
          <p>
            Sincronize uma turma em{" "}
            <Link href="/professor/turma" style={{ color: "var(--primary)" }}>
              Turma
            </Link>{" "}
            para ver os alunos aqui.
          </p>
        </div>
      </>
    );
  }

  const { students } = await getCourseOverview(course.id);

  return (
    <>
      <div className="page-header flex items-center justify-between" style={{ flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2>Alunos 👥</h2>
          <p>Perfil de autorregulação de cada aluno com base na aplicação mais recente do questionário.</p>
        </div>
        <a href={`/api/professor/export?course_id=${course.id}`} className="btn btn-secondary btn-sm">
          ⬇️ Exportar XLSX
        </a>
      </div>

      <AlunosTable students={students} limite={course.limite} />
    </>
  );
}
