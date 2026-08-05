import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CLASSROOM_BASE = "https://classroom.googleapis.com/v1";

export class GoogleTokenMissingError extends Error {
  constructor() {
    super("Você ainda não autorizou o acesso ao Google Classroom. Saia e faça login novamente como professor.");
  }
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error(`Falha ao renovar token do Google (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

/** Busca o refresh_token guardado em google_tokens (ver 0002_rls.sql — só
 * acessível via service role) e troca por um access_token novo do Google. */
export async function getTeacherAccessToken(teacherId: string): Promise<string> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("google_tokens")
    .select("refresh_token")
    .eq("profile_id", teacherId)
    .maybeSingle();

  if (!data?.refresh_token) throw new GoogleTokenMissingError();
  return refreshAccessToken(data.refresh_token);
}

async function classroomFetch<T>(accessToken: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${CLASSROOM_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Erro na Classroom API (${res.status} ${path}): ${await res.text()}`);
  }

  return (await res.json()) as T;
}

export interface GoogleCourse {
  id: string;
  name: string;
}

export interface GoogleStudent {
  userId: string;
  profile: { name: { fullName: string }; emailAddress: string };
}

export async function listCourses(accessToken: string): Promise<GoogleCourse[]> {
  const data = await classroomFetch<{ courses?: GoogleCourse[] }>(
    accessToken,
    "/courses?courseStates=ACTIVE&teacherId=me&pageSize=100"
  );
  return data.courses ?? [];
}

export async function listStudents(accessToken: string, courseId: string): Promise<GoogleStudent[]> {
  const data = await classroomFetch<{ students?: GoogleStudent[] }>(
    accessToken,
    `/courses/${courseId}/students?pageSize=200`
  );
  return data.students ?? [];
}

export interface GoogleCourseWork {
  id: string;
  title: string;
  workType?: string;
  state?: string;
  maxPoints?: number;
  creationTime?: string;
  dueDate?: { year: number; month: number; day: number };
  alternateLink?: string;
}

export interface GoogleStudentSubmission {
  id: string;
  courseWorkId: string;
  userId: string;
  state?: string; // NEW | CREATED | TURNED_IN | RETURNED | RECLAIMED_BY_STUDENT
  late?: boolean;
  assignedGrade?: number;
  updateTime?: string;
}

export interface GoogleAnnouncement {
  id: string;
  text?: string;
  creationTime?: string;
  alternateLink?: string;
}

async function listAllPages<T>(
  accessToken: string,
  path: string,
  key: string
): Promise<T[]> {
  const items: T[] = [];
  let pageToken: string | undefined;
  do {
    const sep = path.includes("?") ? "&" : "?";
    const data = await classroomFetch<Record<string, unknown>>(
      accessToken,
      `${path}${sep}pageSize=200${pageToken ? `&pageToken=${pageToken}` : ""}`
    );
    items.push(...((data[key] as T[] | undefined) ?? []));
    pageToken = data.nextPageToken as string | undefined;
  } while (pageToken);
  return items;
}

/** Atividades (courseWork) publicadas na turma — base do Dashboard Interação. */
export async function listCourseWork(accessToken: string, courseId: string): Promise<GoogleCourseWork[]> {
  return listAllPages<GoogleCourseWork>(accessToken, `/courses/${courseId}/courseWork`, "courseWork");
}

/** Entregas de todos os alunos, para todas as atividades da turma de uma vez
 * (courseWorkId "-" é um curinga aceito pela Classroom API para isso). */
export async function listAllStudentSubmissions(
  accessToken: string,
  courseId: string
): Promise<GoogleStudentSubmission[]> {
  return listAllPages<GoogleStudentSubmission>(
    accessToken,
    `/courses/${courseId}/courseWork/-/studentSubmissions`,
    "studentSubmissions"
  );
}

export async function listAnnouncements(accessToken: string, courseId: string): Promise<GoogleAnnouncement[]> {
  return listAllPages<GoogleAnnouncement>(accessToken, `/courses/${courseId}/announcements`, "announcements");
}

/**
 * Cria um courseWorkMaterial (o mesmo mecanismo que o Streamlit usava para
 * "enviar dica"). `studentEmails` vazio = para toda a turma; a Classroom API
 * aceita e-mail como identificador de aluno em individualStudentsOptions.
 */
export async function createCourseWorkMaterial(
  accessToken: string,
  courseId: string,
  params: { title: string; description: string; studentEmails?: string[] }
): Promise<{ id: string }> {
  const body: Record<string, unknown> = {
    title: params.title,
    description: params.description,
    state: "PUBLISHED",
  };

  if (params.studentEmails && params.studentEmails.length > 0) {
    body.assigneeMode = "INDIVIDUAL_STUDENTS";
    body.individualStudentsOptions = { studentIds: params.studentEmails };
  }

  return classroomFetch<{ id: string }>(accessToken, `/courses/${courseId}/courseWorkMaterials`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
