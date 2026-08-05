"use server";

import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getTeacherAccessToken,
  listCourses,
  listStudents,
  createCourseWorkMaterial,
} from "@/lib/google/classroom";

export type ActionState = { error?: string; success?: string } | undefined;

export async function fetchGoogleCourses(): Promise<
  { courses?: { id: string; name: string }[]; error?: string }
> {
  const { profile } = await requireProfile("professor");
  try {
    const token = await getTeacherAccessToken(profile.id);
    const courses = await listCourses(token);
    return { courses };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao listar turmas do Classroom." };
  }
}

export async function syncCourse(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { profile } = await requireProfile("professor");
  const googleCourseId = (formData.get("google_course_id") as string) || "";
  const name = (formData.get("name") as string) || "";

  if (!googleCourseId || !name) {
    return { error: "Selecione uma turma do Classroom." };
  }

  try {
    const token = await getTeacherAccessToken(profile.id);
    const students = await listStudents(token, googleCourseId);

    const admin = createAdminClient();

    const { data: course, error: courseError } = await admin
      .from("courses")
      .upsert(
        { google_course_id: googleCourseId, name, teacher_id: profile.id },
        { onConflict: "google_course_id" }
      )
      .select("id")
      .single();

    if (courseError || !course) {
      return { error: courseError?.message ?? "Falha ao salvar a turma." };
    }

    if (students.length > 0) {
      await admin.from("course_roster").upsert(
        students.map((s) => ({
          course_id: course.id,
          email: s.profile.emailAddress,
          name: s.profile.name.fullName,
          google_user_id: s.userId,
        })),
        { onConflict: "course_id,email" }
      );

      // reconcilia na hora com alunos que já tenham logado antes da sincronização
      const { data: existingProfiles } = await admin
        .from("profiles")
        .select("id, email")
        .in(
          "email",
          students.map((s) => s.profile.emailAddress)
        );

      if (existingProfiles && existingProfiles.length > 0) {
        await admin.from("enrollments").upsert(
          existingProfiles.map((p) => ({ course_id: course.id, student_id: p.id })),
          { onConflict: "course_id,student_id", ignoreDuplicates: true }
        );
      }
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao sincronizar a turma." };
  }

  redirect("/professor/dashboard");
}

export async function sendRecommendation(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { profile } = await requireProfile("professor");
  const supabase = await createClient();

  const courseId = (formData.get("course_id") as string) || "";
  const studentId = (formData.get("student_id") as string) || ""; // "" = turma toda
  const constructo = (formData.get("constructo") as string) || null;
  const title = ((formData.get("title") as string) || "").trim();
  const content = ((formData.get("content") as string) || "").trim();

  if (!courseId || !title || !content) {
    return { error: "Preencha destinatário, título e conteúdo." };
  }

  const { data: course } = await supabase
    .from("courses")
    .select("google_course_id")
    .eq("id", courseId)
    .single();

  if (!course) return { error: "Turma não encontrada." };

  let studentEmail: string | null = null;
  if (studentId) {
    const { data: student } = await supabase.from("profiles").select("email").eq("id", studentId).single();
    studentEmail = student?.email ?? null;
  }

  const { data: rec, error: insertError } = await supabase
    .from("recommendations")
    .insert({
      teacher_id: profile.id,
      student_id: studentId || null,
      course_id: courseId,
      constructo,
      title,
      content,
      auto: false,
    })
    .select("id")
    .single();

  if (insertError || !rec) {
    return { error: insertError?.message ?? "Falha ao salvar a sugestão." };
  }

  try {
    const token = await getTeacherAccessToken(profile.id);
    const material = await createCourseWorkMaterial(token, course.google_course_id, {
      title,
      description: content,
      studentEmails: studentEmail ? [studentEmail] : undefined,
    });
    await supabase
      .from("recommendations")
      .update({ classroom_courseworkmaterial_id: material.id })
      .eq("id", rec.id);
  } catch (e) {
    // a sugestão já está salva no app; só a publicação no Classroom falhou
    return {
      success:
        "Sugestão salva no app, mas não foi possível publicar no Google Classroom: " +
        (e instanceof Error ? e.message : "erro desconhecido"),
    };
  }

  return { success: "Sugestão enviada e publicada no Google Classroom!" };
}
