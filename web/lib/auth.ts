import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/supabase/types";

// Busca o usuário logado + profile; redireciona para /login se não houver
// sessão, e para o dashboard correto se o papel não bater com o esperado
// (evita que um aluno acesse /professor/* digitando a URL, e vice-versa).
export async function requireProfile(expectedRole?: Role): Promise<{ profile: Profile }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  if (expectedRole && profile.role !== expectedRole) {
    redirect(profile.role === "professor" ? "/professor/dashboard" : "/aluno/questionario");
  }

  return { profile };
}
