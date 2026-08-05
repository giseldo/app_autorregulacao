import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Troca o `code` do OAuth por uma sessão, garante que o profile exista com um
// papel (aluno/professor) e, para professor, guarda o refresh_token do Google
// em google_tokens — necessário porque o Supabase não renova sozinho o token
// do provedor (ver plano em C:\Users\gigi\.claude\plans\partitioned-juggling-peach.md).
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedRole = url.searchParams.get("role");
  const next = url.searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session || !data.user) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", url.origin));
  }

  const { user, session } = data;
  const admin = createAdminClient();

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // O papel só é definido no primeiro login (a aba escolhida na tela de login).
  // Em logins seguintes, o papel já salvo prevalece — evita que clicar na aba
  // errada troque o perfil de alguém que já está em uso.
  const finalRole = existingProfile?.role ?? (requestedRole === "professor" ? "professor" : "aluno");

  await admin.from("profiles").upsert({
    id: user.id,
    email: user.email ?? "",
    name:
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      user.email ??
      "Usuário",
    avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    role: finalRole,
  });

  if (finalRole === "professor" && session.provider_refresh_token) {
    await admin.from("google_tokens").upsert({
      profile_id: user.id,
      refresh_token: session.provider_refresh_token,
      updated_at: new Date().toISOString(),
    });
  }

  // Reconcilia matrícula: se o professor já sincronizou o roster do Classroom
  // antes deste aluno logar pela 1ª vez, o e-mail já está em course_roster —
  // cria a enrollment real agora que profiles.id existe.
  if (finalRole === "aluno" && user.email) {
    const { data: rosterRows } = await admin
      .from("course_roster")
      .select("course_id")
      .eq("email", user.email);

    if (rosterRows && rosterRows.length > 0) {
      await admin.from("enrollments").upsert(
        rosterRows.map((r) => ({ course_id: r.course_id, student_id: user.id })),
        { onConflict: "course_id,student_id", ignoreDuplicates: true }
      );
    }
  }

  const destination = finalRole === "professor" ? "/professor/dashboard" : "/aluno/questionario";
  return NextResponse.redirect(new URL(next ?? destination, url.origin));
}
