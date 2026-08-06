# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

NeoAVA-ARA gives students and teachers a self-regulated-learning (autorregulação) dashboard integrated with Google Classroom, built around the MSLQ (Motivated Strategies for Learning Questionnaire — 44 items / 13 subscales). It supports Alana Viana Borges Neo's PhD research: the workflow is students apply the MSLQ (possibly more than once), the teacher sends recommendations targeting low-scoring constructs, and a later re-application shows whether the recommendation had an effect.

**The active application is the Next.js app in [web/](web/).** It replaced the original Streamlit app (still present at the repo root for reference — see "Legacy Streamlit app" below, no longer maintained/deployed). Big Five was dropped when porting to the new app; only the MSLQ remains.

## Running the app (web/)

```bash
cd web
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + typecheck
npm run lint
```

### Environment variables (`web/.env.local`, see `web/.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GROQ_API_KEY=
```

`GOOGLE_CLIENT_ID`/`SECRET` must be the **same** OAuth Web Client configured in the Supabase dashboard (Authentication → Providers → Google) — the app needs them again directly because Supabase does not persist/refresh the Google `provider_token` after login; [lib/google/classroom.ts](web/lib/google/classroom.ts) exchanges the stored `refresh_token` for a fresh access token itself on every Classroom API call.

`GROQ_API_KEY` (from [console.groq.com/keys](https://console.groq.com/keys)) powers the chat assistant in [lib/groq.ts](web/lib/groq.ts) / [app/api/chat/route.ts](web/app/api/chat/route.ts) — without it the chatbot returns a friendly "not configured" error instead of crashing. There's a status readout (configured or not) on `/professor/configuracoes`, which also has a button to test the "auto tip" mechanism (`recommendations.auto = true`, currently a fixed placeholder message — no real schedule wired up yet).

Database schema/RLS/seed data live in [web/supabase/migrations/](web/supabase/migrations/) — run them against a Supabase project (SQL editor or `supabase db push`) in file order (`0001` → `0004`) before first use.

## Architecture (web/)

**Next.js 16 App Router**, TypeScript, Tailwind for the base reset + a hand-written design system in [app/globals.css](web/app/globals.css) (ported 1:1 from the static mockup `index_.html` at the repo root — same CSS variables/class names: `.card`, `.sidebar`, `.likert-btn`, `.score-badge`, etc). Next 16 renamed `middleware.ts` to **`proxy.ts`** (exported function is `proxy`, not `middleware`) — [web/proxy.ts](web/proxy.ts) refreshes the Supabase session cookie and gates unauthenticated access to everything except `/login`, `/auth/*`, `/sobre`.

**Auth & roles.** Supabase Auth (Google provider) for both roles. The login screen ([app/login/page.tsx](web/app/login/page.tsx)) has the aluno/professor tabs the role is picked *before* the OAuth redirect (not after), because the requested Google scopes differ: students get plain `openid email profile`; teachers additionally get Classroom read scopes + `classroom.courseworkmaterials`, requested with `access_type=offline&prompt=consent` to obtain a refresh token. [app/auth/callback/route.ts](web/app/auth/callback/route.ts) exchanges the code, upserts `profiles` (role is set only on first login — later logins keep the saved role regardless of which tab was clicked), and for teachers stores `provider_refresh_token` in `google_tokens` (a service-role-only table, no RLS policies for `anon`/`authenticated`).

**Roster sync (`course_roster`).** A student's `profiles.id` must equal their `auth.users.id`, which doesn't exist until they log in once — so a teacher-synced Classroom roster can't create real `enrollments` rows up front. [app/actions/professor.ts](web/app/actions/professor.ts) `syncCourse` stages the roster in `course_roster` (course_id/email/name/google_user_id, no FK to auth) and immediately reconciles against any `profiles` that already exist by email; the auth callback does the same reconciliation on every new student login. Read both together when touching roster/enrollment logic.

**MSLQ scoring** lives in [lib/mslq.ts](web/lib/mslq.ts): construct definitions (icons/help text, ported from the old Streamlit `help_*` strings) and `scoreConstructs()`, which averages answers per construct and **inverts reverse-keyed items** (`q35`, `q36`, `q41` — flagged via `mslq_questions.reversa`, computed as `8 - valor` on the 1–7 scale). This is a deliberate correction versus the original Streamlit app, which averaged those items raw without inverting them — see the comment in [0003_seed_mslq_questions.sql](web/supabase/migrations/0003_seed_mslq_questions.sql) if exact parity with old Streamlit numbers is ever needed instead.

**One "aplicação" = one full MSLQ submission**, not a daily check-in — a student can submit multiple over time (`mslq_applications` + `mslq_answers`). [components/ApplicationsComparison.tsx](web/components/ApplicationsComparison.tsx) is the piece that matters most for the research: for each pair of consecutive applications it shows which recommendations were sent in between and whether the targeted construct moved in the right direction (accounting for the inverted Ansiedade construct). It's used both in the student's own histórico and in the teacher's per-student view — keep it accepting plain `{ application, scores }[]` rather than fetching its own student list, so it stays reusable both places.

**Recommendations are dual-written**: `sendRecommendation` in [app/actions/professor.ts](web/app/actions/professor.ts) inserts into `recommendations` *and* calls the Classroom API (`createCourseWorkMaterial` in [lib/google/classroom.ts](web/lib/google/classroom.ts)) to publish the same content as a `courseWorkMaterial`, storing the returned id back on the row. If the Classroom call fails, the in-app row is kept (the action returns a warning, not a hard failure) — publishing to Classroom is best-effort, not a transaction with the DB write. Recommendation templates come from `recommendation_templates`/`recommendation_template_constructs` (seeded from the old `datasets/dicas.csv`, 9 templates covering 12 of the 13 MSLQ constructs — "Pensamento Crítico" has no dedicated template, matching a gap that already existed in the Streamlit app).

**One active course per teacher.** `getActiveCourse()` in [lib/professorData.ts](web/lib/professorData.ts) just takes the teacher's most-recently-synced course — same simplification the Streamlit app made (`id_curso_selecionado` in session state). If multi-course support is ever needed, this is the place to add course switching.

**RLS** ([0002_rls.sql](web/supabase/migrations/0002_rls.sql)) is enforced through `SECURITY DEFINER` helper functions (`is_teacher_of_course`, `is_enrolled`, `is_teacher_of_student`) rather than inline joins in every policy, specifically to avoid recursive policy evaluation between `courses` and `enrollments`. `google_tokens` and `course_roster` writes have no RLS policies at all for `anon`/`authenticated` — they're only ever touched via `lib/supabase/admin.ts` (service-role client, `server-only`, never importable from a Client Component).

**Supabase client split:** [lib/supabase/client.ts](web/lib/supabase/client.ts) (browser), [server.ts](web/lib/supabase/server.ts) (Server Components/Actions, cookie-bound, respects RLS), [admin.ts](web/lib/supabase/admin.ts) (service role, bypasses RLS, `server-only`). `lib/supabase/types.ts` hand-writes the `Database` type — **must use `type`, not `interface`**, for every row shape (interfaces don't structurally satisfy the `Record<string, unknown>` constraint `SupabaseClient<Database>` needs internally; using `interface` silently collapses every `Row`/`Insert`/`Update` to `never` with no error until you use the client). Regenerate with `supabase gen types typescript` once a live project exists, instead of hand-maintaining this if it drifts.

### Route map

| Route | Who | Purpose |
|---|---|---|
| `/login` | — | Google OAuth, role tabs |
| `/auth/callback` | — | OAuth code exchange, profile/role/token upsert, roster reconciliation |
| `/aluno/questionario` | aluno | Fill the 44-item MSLQ |
| `/aluno/historico` | aluno | Radar + evolution charts, `ApplicationsComparison`, past applications |
| `/aluno/sugestoes` | aluno | Recommendation inbox (marks read on view) |
| `/professor/turma` | professor | Sync a Google Classroom course + roster |
| `/professor/dashboard` | professor | Class KPIs, radar, at-risk list |
| `/professor/alunos`, `/professor/alunos/[id]` | professor | Full roster table / one student's detail (mirrors the aluno histórico view) |
| `/professor/enviar-sugestao` | professor | Compose a recommendation from a template or free text |

## Legacy Streamlit app (repo root)

Kept for reference/history only — not run or deployed anymore. It was a Streamlit multipage app (`1_Principal.py` + `pages/`) reading MSLQ **and Big Five** responses live from two Google Sheets, with construct scores computed positionally (`dfreg.iloc[N]`) rather than via a question-id mapping. `google/*.py` are standalone Google API sample scripts (different, file-based OAuth flow) never imported by the app. `datasets/mslq.csv` and `datasets/dicas.csv` are the same source data now seeded into Supabase for the new app (see `web/supabase/migrations/0003`/`0004`).

If you do need to run it: `pip install -r requirements.txt && streamlit run 1_Principal.py --server.enableCORS false --server.enableXsrfProtection false`, with a root `.env` providing `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`/`GOOGLE_REDIRECT_URI`. `req.txt` is a stale UTF-16 `pip freeze` dump, not a real dependency list — ignore it.
