import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Cliente com a service role key: ignora RLS. Só pode ser importado a partir
// de código server-only (Route Handlers / Server Actions) — nunca de um
// Client Component. Usado para: upsert de profiles/roster vindos do Classroom,
// leitura/escrita de google_tokens (que não tem nenhuma policy de RLS).
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
