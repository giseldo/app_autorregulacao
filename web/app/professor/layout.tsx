import type { ReactNode } from "react";
import { requireProfile } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";

export default async function ProfessorLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireProfile("professor");

  const navItems = [
    { href: "/professor/dashboard", icon: "📊", label: "Dashboard" },
    { href: "/professor/dashboard-interacao", icon: "🤝", label: "Dashboard Interação" },
    { href: "/professor/alunos", icon: "👥", label: "Alunos" },
    { href: "/professor/enviar-sugestao", icon: "✉️", label: "Enviar Sugestão" },
    { href: "/professor/turma", icon: "🏫", label: "Turma" },
  ];

  return (
    <AppShell profile={profile} navItems={navItems}>
      {children}
    </AppShell>
  );
}
