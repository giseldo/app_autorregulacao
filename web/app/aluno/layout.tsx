import type { ReactNode } from "react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/AppShell";

export default async function AlunoLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireProfile("aluno");
  const supabase = await createClient();

  const [{ data: recs }, { data: reads }] = await Promise.all([
    supabase.from("recommendations").select("id"),
    supabase.from("recommendation_reads").select("recommendation_id").eq("student_id", profile.id),
  ]);

  const readIds = new Set((reads ?? []).map((r) => r.recommendation_id));
  const unread = (recs ?? []).filter((r) => !readIds.has(r.id)).length;

  const navItems = [
    { href: "/aluno/questionario", icon: "📝", label: "Responder Questionário" },
    { href: "/aluno/historico", icon: "📈", label: "Meu Histórico" },
    { href: "/aluno/sugestoes", icon: "💡", label: "Sugestões", badge: unread || undefined },
  ];

  return (
    <AppShell profile={profile} navItems={navItems}>
      {children}
    </AppShell>
  );
}
