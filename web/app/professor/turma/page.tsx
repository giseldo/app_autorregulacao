import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SyncCourseForm } from "@/components/SyncCourseForm";

export default async function TurmaPage() {
  const { profile } = await requireProfile("professor");
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("teacher_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="page-header">
        <h2>Turma 🏫</h2>
        <p>Sincronize sua turma do Google Classroom para carregar a lista de alunos.</p>
      </div>

      {courses && courses.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">
            <h3>Turmas sincronizadas</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Limite (score baixo/alto)</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.limite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <SyncCourseForm />
    </>
  );
}
