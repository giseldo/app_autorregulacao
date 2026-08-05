import { createClient } from "@/lib/supabase/server";
import { MslqForm } from "@/components/MslqForm";

export default async function QuestionarioPage() {
  const supabase = await createClient();
  const { data: questions } = await supabase
    .from("mslq_questions")
    .select("*")
    .order("ordem", { ascending: true });

  return (
    <>
      <div className="page-header">
        <h2>Questionário MSLQ 📝</h2>
        <p>Motivated Strategies for Learning Questionnaire — sua percepção sobre motivação e estratégias de estudo.</p>
      </div>
      <MslqForm questions={questions ?? []} />
    </>
  );
}
