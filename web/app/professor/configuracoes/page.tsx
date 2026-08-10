import { requireProfile } from "@/lib/auth";
import { getActiveCourse } from "@/lib/professorData";
import { getLlmSettingsPublic } from "@/lib/llm";
import { LlmSettingsForm } from "@/components/LlmSettingsForm";
import { AutoTipTestButton } from "@/components/AutoTipTestButton";
import { AutoTipRunButton } from "@/components/AutoTipRunButton";

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

      <div className="card mb-4">
        <div className="card-header">
          <h3>Dicas automáticas 🤖</h3>
        </div>
        <div className="card-body">
          <p className="text-sm mb-3">
            Toda segunda-feira às 8h (cron da Vercel, ver <code>vercel.json</code>) o app olha a aplicação mais
            recente de cada aluno de cada turma, acha o construto mais abaixo do limite configurado e envia o
            template de recomendação correspondente — gravado em <code>recommendations</code> com{" "}
            <code>auto = true</code> e publicado no Classroom, igual a uma sugestão manual. Um aluno não recebe
            duas dicas automáticas para o mesmo construto em menos de 7 dias, mesmo que o cron rode de novo antes
            disso.
          </p>
          {course ? (
            <>
              <p className="text-xs text-muted mb-3">
                Roda para a turma ativa <strong>{course.name}</strong> — um aluno por construto abaixo do limite,
                sem repetir quem já recebeu dica do mesmo construto nos últimos 7 dias.
              </p>
              <AutoTipRunButton />
            </>
          ) : (
            <p className="text-sm text-muted">Sincronize uma turma em Turma antes de rodar.</p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Testar publicação no Classroom</h3>
        </div>
        <div className="card-body">
          <p className="text-sm mb-3">
            Envia uma mensagem fixa de exemplo para toda a turma, só para validar que o app consegue publicar no
            Google Classroom (mesmo mecanismo acima, sem a lógica de construto por aluno).
          </p>
          {course ? (
            <AutoTipTestButton />
          ) : (
            <p className="text-sm text-muted">Sincronize uma turma em Turma antes de testar.</p>
          )}
        </div>
      </div>
    </>
  );
}
