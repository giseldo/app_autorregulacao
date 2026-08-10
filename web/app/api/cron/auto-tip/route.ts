import { NextResponse } from "next/server";
import { runAutoTipsForAllCourses } from "@/lib/autoTip";

/** Chamado pelo Vercel Cron (ver vercel.json) — roda a dica automática por
 * construto para todas as turmas de todos os professores. Protegido por
 * CRON_SECRET: a Vercel injeta o header `Authorization: Bearer $CRON_SECRET`
 * automaticamente quando a env var CRON_SECRET está configurada no projeto. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const results = await runAutoTipsForAllCourses();
  const totalSent = results.reduce((acc, r) => acc + r.sent.length, 0);

  return NextResponse.json({ totalSent, results });
}
