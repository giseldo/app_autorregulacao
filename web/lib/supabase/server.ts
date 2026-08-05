import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

// Cliente Supabase para Server Components / Route Handlers / Server Actions.
// Usa os cookies da requisição (via @supabase/ssr) para ler a sessão do usuário
// logado — respeita RLS normalmente (não é o admin/service-role client).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // set() chamado a partir de um Server Component: ignorável, o
            // proxy.ts já cuida de renovar a sessão a cada navegação.
          }
        },
      },
    }
  );
}
