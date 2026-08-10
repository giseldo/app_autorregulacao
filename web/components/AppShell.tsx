import type { ReactNode } from "react";
import { signOut } from "@/app/actions/auth";
import type { Profile } from "@/lib/supabase/types";
import { SidebarNav, type NavItem } from "./SidebarNav";
import { Chatbot } from "./Chatbot";

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function AppShell({
  profile,
  navItems,
  courseName,
  courseSwitcher,
  children,
}: {
  profile: Profile;
  navItems: NavItem[];
  /** Turma do Google Classroom em uso, mostrada no topo da sidebar. */
  courseName?: string | null;
  /** Seletor de turma (só passado quando o professor tem mais de uma turma
   * sincronizada) — substitui o texto simples do nome da turma. */
  courseSwitcher?: ReactNode;
  children: ReactNode;
}) {
  const isTeacher = profile.role === "professor";

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">NeoAVA-ARA</div>
          <div className="sidebar-role">{isTeacher ? "Professor(a)" : "Aluno(a)"}</div>
          {courseSwitcher ? (
            <div className="sidebar-course">
              🏫 {courseSwitcher}
            </div>
          ) : (
            courseName && <div className="sidebar-course">🏫 {courseName}</div>
          )}
        </div>
        <div className="sidebar-user">
          <div className={`avatar avatar-${isTeacher ? "teacher" : "student"}`}>
            {initialsOf(profile.name)}
          </div>
          <div className="user-info">
            <div className="name">{profile.name}</div>
            <div className="email">{profile.email}</div>
          </div>
        </div>

        <SidebarNav items={navItems} />

        <div className="sidebar-footer">
          <form action={signOut}>
            <button
              type="submit"
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", justifyContent: "center" }}
            >
              ← Sair
            </button>
          </form>
        </div>
      </nav>
      <main className="main-content">{children}</main>
      <Chatbot role={isTeacher ? "professor" : "aluno"} />
    </div>
  );
}
