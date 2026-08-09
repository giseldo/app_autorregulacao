import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getActiveCourse } from "@/lib/professorData";
import { ImportMslqForm } from "@/components/ImportMslqForm";

export default async function ImportarPage() {
  const { profile } = await requireProfile("professor");
  const course = await getActiveCourse(profile.id);

  if (!course) {
    return (
      <>
        <div className="page-header">
          <h2>Importar Questionário 📥</h2>
        </div>
        <div className="empty-state">
          <div className="icon">🏫</div>
          <p>
            Sincronize uma turma em{" "}
            <Link href="/professor/turma" style={{ color: "var(--primary)" }}>
              Turma
            </Link>{" "}
            antes de importar respostas.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h2>Importar Questionário 📥</h2>
        <p>
          Turma: <strong>{course.name}</strong> — carregue respostas coletadas fora do app (pré-teste,
          pós-teste ou uma 3ª aplicação), mesmo de alunos que ainda não fizeram login.
        </p>
      </div>
      <ImportMslqForm />
    </>
  );
}
