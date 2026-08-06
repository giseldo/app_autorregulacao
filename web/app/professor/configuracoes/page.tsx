import { requireProfile } from "@/lib/auth";
import { getActiveCourse } from "@/lib/professorData";
import { AutoTipTestButton } from "@/components/AutoTipTestButton";

export default async function ConfiguracoesPage() {
  const { profile } = await requireProfile("professor");
  const course = await getActiveCourse(profile.id);
  const groqConfigured = !!process.env.GROQ_API_KEY;

  return (
    <>
      <div className="page-header">
        <h2>Configurações ⚙️</h2>
        <p>Chatbot de apoio e dicas automáticas.</p>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3>Chatbot (Groq)</h3>
        </div>
        <div className="card-body">
          <p className="text-sm">
            O botão de chat 💬 no canto da tela (visível para aluno e professor) é respondido pela API da{" "}
            <strong>Groq</strong>. A chave fica só no servidor, configurada via variável de ambiente — não dá
            para editar por aqui por segurança.
          </p>
          <div className={`alert ${groqConfigured ? "alert-success" : "alert-warning"} mt-3`}>
            <span>{groqConfigured ? "✅" : "⚠️"}</span>
            <div>
              {groqConfigured ? (
                "GROQ_API_KEY configurada — o chatbot está ativo."
              ) : (
                <>
                  <strong>GROQ_API_KEY</strong> não configurada. Crie uma chave em{" "}
                  <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                    console.groq.com/keys
                  </a>{" "}
                  e adicione como variável de ambiente do projeto (<code>web/.env.local</code> local, ou nas
                  Environment Variables do Vercel em produção) — depois faça um novo deploy.
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Dicas automáticas</h3>
        </div>
        <div className="card-body">
          <p className="text-sm mb-3">
            No futuro, o chatbot vai analisar as respostas do MSLQ de tempos em tempos e enviar dicas e
            recomendações automaticamente para os alunos com construtos baixos — sem o professor precisar
            enviar manualmente. Isso ainda não está agendado; por enquanto dá pra testar o mecanismo (grava em{" "}
            <code>recommendations</code> com <code>auto = true</code> e publica no Classroom, igual a uma
            sugestão manual) com um conteúdo fixo de exemplo abaixo.
          </p>
          {course ? (
            <>
              <p className="text-xs text-muted mb-3">
                Vai ser enviada para toda a turma <strong>{course.name}</strong>, marcada com 🤖 no inbox de
                sugestões do aluno.
              </p>
              <AutoTipTestButton />
            </>
          ) : (
            <p className="text-sm text-muted">Sincronize uma turma em Turma antes de testar.</p>
          )}
        </div>
      </div>
    </>
  );
}
