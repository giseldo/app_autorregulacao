import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  getTeacherAccessToken,
  listCourseWork,
  listAllStudentSubmissions,
  listAnnouncements,
} from "@/lib/google/classroom";

const TURNED_IN_STATES = new Set(["TURNED_IN", "RETURNED"]);

export interface AssignmentInteraction {
  id: string;
  title: string;
  workType?: string;
  dueDate: string | null;
  alternateLink?: string;
  turnedIn: number;
  total: number;
  rate: number;
}

export interface StudentInteraction {
  name: string;
  email: string;
  turnedIn: number;
  pending: number;
  late: number;
  avgGrade: number | null;
}

export interface CourseInteraction {
  totalAssignments: number;
  totalAnnouncements: number;
  totalSubmissions: number;
  turnedInCount: number;
  lateCount: number;
  submissionRate: number;
  assignments: AssignmentInteraction[];
  students: StudentInteraction[];
}

function fmtDueDate(d?: { year: number; month: number; day: number }) {
  if (!d) return null;
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}

/** Agrega dados de interação (atividades, entregas, avisos) direto da
 * Classroom API — não é persistido no Supabase, é sempre lido ao vivo, como
 * o sync de turma já faz. */
export async function getCourseInteraction(
  teacherId: string,
  courseId: string,
  googleCourseId: string
): Promise<CourseInteraction> {
  const token = await getTeacherAccessToken(teacherId);
  const [courseWork, submissions, announcements] = await Promise.all([
    listCourseWork(token, googleCourseId),
    listAllStudentSubmissions(token, googleCourseId),
    listAnnouncements(token, googleCourseId),
  ]);

  const supabase = await createClient();
  const { data: roster } = await supabase.from("course_roster").select("*").eq("course_id", courseId);
  const byGoogleId = new Map((roster ?? []).map((r) => [r.google_user_id, r]));

  const assignmentMap = new Map<string, AssignmentInteraction>(
    courseWork.map((w) => [
      w.id,
      {
        id: w.id,
        title: w.title,
        workType: w.workType,
        dueDate: fmtDueDate(w.dueDate),
        alternateLink: w.alternateLink,
        turnedIn: 0,
        total: 0,
        rate: 0,
      },
    ])
  );

  const studentMap = new Map<string, StudentInteraction & { _gradeSum: number; _gradeCount: number }>(
    (roster ?? []).map((r) => [
      r.google_user_id,
      { name: r.name, email: r.email, turnedIn: 0, pending: 0, late: 0, avgGrade: null, _gradeSum: 0, _gradeCount: 0 },
    ])
  );

  let turnedInCount = 0;
  let lateCount = 0;

  for (const s of submissions) {
    const isTurnedIn = s.state ? TURNED_IN_STATES.has(s.state) : false;
    if (isTurnedIn) turnedInCount += 1;
    if (s.late) lateCount += 1;

    const assignment = assignmentMap.get(s.courseWorkId);
    if (assignment) {
      assignment.total += 1;
      if (isTurnedIn) assignment.turnedIn += 1;
    }

    const student = studentMap.get(s.userId);
    if (student) {
      if (isTurnedIn) student.turnedIn += 1;
      else student.pending += 1;
      if (s.late) student.late += 1;
      if (s.assignedGrade != null) {
        student._gradeSum += s.assignedGrade;
        student._gradeCount += 1;
      }
    }
  }

  const assignments = [...assignmentMap.values()]
    .map((a) => ({ ...a, rate: a.total ? a.turnedIn / a.total : 0 }))
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));

  const students = [...studentMap.values()]
    .map(({ _gradeSum, _gradeCount, ...rest }) => ({
      ...rest,
      avgGrade: _gradeCount ? Number((_gradeSum / _gradeCount).toFixed(1)) : null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return {
    totalAssignments: courseWork.length,
    totalAnnouncements: announcements.length,
    totalSubmissions: submissions.length,
    turnedInCount,
    lateCount,
    submissionRate: submissions.length ? turnedInCount / submissions.length : 0,
    assignments,
    students,
  };
}
