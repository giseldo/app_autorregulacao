import { requireProfile } from "@/lib/auth";
import { getActiveCourse } from "@/lib/professorData";
import { getLlmSettingsPublic } from "@/lib/llm";
import { LlmSettingsForm } from "@/components/LlmSettingsForm";
import { AutoTipTestButton } from "@/components/AutoTipTestButton";

export default async function ConfiguracoesPage() {
  const { profile } = await requireProfile("professor");
  const course = await getActiveCourse(profile.id);
  const llmSettings = await getLlmSettingsPublic();

  return (
    <>
      <div className="page-header">
        <h2>Configurações ⚙️</h2>
        <p>Chatbot de apoio e dicas automáticas.</p>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3>Chatbot (modelo LLM)</h3>
        </div>
        <div className="card-body">
          <p className="text-sm mb-3">
            O botão de chat 💬 no canto da tela (visível para aluno e professor) é respondido pelo provedor e
            modelo escolhidos aqui. Vale pra turma toda — é uma configuração única do app, não por professor.
          </p>
          <LlmSettingsForm
            initialProvider={llmSettings.provider}
            initialModel={llmSettings.model}
            hasApiKey={llmSettings.hasApiKey}
          />
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
