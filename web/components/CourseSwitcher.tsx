"use client";

import { switchActiveCourse } from "@/app/actions/professor";

export function CourseSwitcher({ courses, activeId }: { courses: { id: string; name: string }[]; activeId: string }) {
  return (
    <form action={switchActiveCourse}>
      <select
        name="course_id"
        defaultValue={activeId}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="course-switcher-select"
        aria-label="Trocar turma ativa"
      >
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </form>
  );
}
