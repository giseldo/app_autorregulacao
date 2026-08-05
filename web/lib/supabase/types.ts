// Tipos manuais do schema (web/supabase/migrations). Gere via `supabase gen types
// typescript` quando o projeto Supabase estiver criado, para manter 100% em sincronia.
//
// IMPORTANTE: usar `type` (não `interface`) para as linhas de tabela.
// Interfaces não satisfazem estruturalmente `Record<string, unknown>`, e o
// SupabaseClient<Database> genérico exige isso para casar cada tabela — com
// `interface` todo Row/Insert/Update vira silenciosamente `never`.

export type Role = "aluno" | "professor";

export type Profile = {
  id: string;
  role: Role | null;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
};

export type Course = {
  id: string;
  google_course_id: string;
  name: string;
  teacher_id: string;
  limite: number;
  created_at: string;
};

export type Enrollment = {
  course_id: string;
  student_id: string;
  created_at: string;
};

export type CourseRoster = {
  course_id: string;
  email: string;
  name: string;
  google_user_id: string;
  created_at: string;
};

export type GoogleTokenRow = {
  profile_id: string;
  refresh_token: string;
  updated_at: string;
};

export type MslqQuestion = {
  id_questao: string;
  tipo: string;
  constructo: string;
  dsc_questao: string;
  ordem: number;
  reversa: boolean;
};

export type MslqApplication = {
  id: string;
  student_id: string;
  course_id: string | null;
  label: string | null;
  applied_at: string;
};

export type MslqAnswer = {
  application_id: string;
  id_questao: string;
  valor: number;
};

export type RecommendationTemplate = {
  id: number;
  tipo: string;
  titulo: string;
  constructo_grupo: string;
  texto: string;
};

export type RecommendationTemplateConstruct = {
  template_id: number;
  constructo: string;
};

export type Recommendation = {
  id: string;
  teacher_id: string;
  student_id: string | null;
  /** E-mail de destino quando o alvo é um aluno do roster sem login/profile ainda. */
  roster_email: string | null;
  course_id: string;
  constructo: string | null;
  title: string;
  content: string;
  classroom_courseworkmaterial_id: string | null;
  auto: boolean;
  created_at: string;
};

export type RecommendationRead = {
  recommendation_id: string;
  student_id: string;
  read_at: string;
};

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, Partial<Profile> & { id: string; name: string; email: string }>;
      courses: Table<Course, Partial<Course> & { google_course_id: string; name: string; teacher_id: string }>;
      enrollments: Table<Enrollment, Partial<Enrollment> & { course_id: string; student_id: string }>;
      course_roster: Table<
        CourseRoster,
        Partial<CourseRoster> & { course_id: string; email: string; name: string; google_user_id: string }
      >;
      google_tokens: Table<GoogleTokenRow, GoogleTokenRow>;
      mslq_questions: Table<MslqQuestion, MslqQuestion>;
      mslq_applications: Table<MslqApplication, Partial<MslqApplication> & { student_id: string }>;
      mslq_answers: Table<MslqAnswer, MslqAnswer>;
      recommendation_templates: Table<RecommendationTemplate, RecommendationTemplate>;
      recommendation_template_constructs: Table<RecommendationTemplateConstruct, RecommendationTemplateConstruct>;
      recommendations: Table<
        Recommendation,
        Partial<Recommendation> & { teacher_id: string; course_id: string; title: string; content: string }
      >;
      recommendation_reads: Table<
        RecommendationRead,
        Partial<RecommendationRead> & { recommendation_id: string; student_id: string }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
