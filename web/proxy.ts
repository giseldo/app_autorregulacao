import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Next.js 16 renomeou "middleware.ts" para "proxy.ts" (função exportada
// também precisa se chamar `proxy`, não mais `middleware`). Aqui: renova a
// sessão do Supabase a cada navegação e bloqueia rotas protegidas para quem
// não está logado.
const PUBLIC_PATHS = ["/login", "/auth", "/sobre"];

// Rotas de API cuidam da própria autenticação (requireProfile devolvendo 401
// em JSON, ou CRON_SECRET no header Authorization para /api/cron/*) — não dá
// pra redirecionar pra /login (uma página HTML) quando quem chama é o cron
// da Vercel ou um fetch de API sem cookie de sessão de navegador.
const API_PREFIX = "/api";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublic = path === "/" || path.startsWith(API_PREFIX) || PUBLIC_PATHS.some((p) => path.startsWith(p));

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
