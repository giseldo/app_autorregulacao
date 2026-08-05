// Escopos Google OAuth pedidos no login. Alunos só precisam de identidade
// básica; professores também precisam ler cursos/alunos do Classroom e criar
// courseWorkMaterials (para o envio de sugestões). Espelha o que o Streamlit
// pedia em 1_Principal.py, reduzido ao que o novo app realmente usa.
export const STUDENT_SCOPES = "openid email profile";

export const TEACHER_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.rosters.readonly",
  "https://www.googleapis.com/auth/classroom.profile.emails",
  "https://www.googleapis.com/auth/classroom.courseworkmaterials",
  // Dashboard Interação: ler atividades/notas/entregas e avisos da turma.
  "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
  "https://www.googleapis.com/auth/classroom.announcements.readonly",
].join(" ");
