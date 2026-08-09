import type { ReactNode } from "react";
import { requireProfile } from "@/lib/auth";
import { getActiveCourse } from "@/lib/professorData";
import { AppShell } from "@/components/AppShell";

export default async function ProfessorLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireProfile("professor");
  const course = await getActiveCourse(profile.id);

  const navItems = [
    { href: "/professor/dashboard", icon: "📊", label: "Dashboard Autorregulação" },
    { href: "/professor/dashboard-interacao", icon: "🤝", label: "Dashboard Interação" },
    { href: "/professor/alunos", icon: "👥", label: "Alunos" },
    { href: "/professor/importar", icon: "📥", label: "Importar Questionário" },
    { href: "/professor/enviar-sugestao", icon: "✉️", label: "Enviar Sugestão" },
    { href: "/professor/turma", icon: "🏫", label: "Turma" },
    { href: "/professor/configuracoes", icon: "⚙️", label: "Configurações" },
  ];

  return (
    <AppShell profile={profile} navItems={navItems} courseName={course?.name}>
      {children}
    </AppShell>
  );
}
