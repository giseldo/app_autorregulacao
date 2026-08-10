import type { ReactNode } from "react";
import { requireProfile } from "@/lib/auth";
import { getActiveCourse, listCoursesForTeacher } from "@/lib/professorData";
import { AppShell } from "@/components/AppShell";
import { CourseSwitcher } from "@/components/CourseSwitcher";

export default async function ProfessorLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireProfile("professor");
  const [course, courses] = await Promise.all([
    getActiveCourse(profile.id),
    listCoursesForTeacher(profile.id),
  ]);

  const navItems = [
    { href: "/professor/dashboard", icon: "📊", label: "Dashboard Autorregulação" },
    { href: "/professor/dashboard-interacao", icon: "🤝", label: "Dashboard Interação" },
    { href: "/professor/dashboard-consolidado", icon: "🧭", label: "Dashboard Consolidado" },
    { href: "/professor/alunos", icon: "👥", label: "Alunos" },
    { href: "/professor/importar", icon: "📥", label: "Importar Questionário" },
    { href: "/professor/enviar-sugestao", icon: "✉️", label: "Enviar Sugestão" },
    { href: "/professor/turma", icon: "🏫", label: "Turma" },
    { href: "/professor/configuracoes", icon: "⚙️", label: "Configurações" },
  ];

  return (
    <AppShell
      profile={profile}
      navItems={navItems}
      courseName={course?.name}
      courseSwitcher={
        course && courses.length > 1 ? <CourseSwitcher courses={courses} activeId={course.id} /> : null
      }
    >
      {children}
    </AppShell>
  );
}
