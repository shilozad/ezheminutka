import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/admin-session";
import { verifySameOrigin } from "@/lib/admin-origin";
export async function POST(request: Request) {
  if (!verifySameOrigin(request))
    return NextResponse.json(
      { ok: false, error: { message: "Запрос отклонён." } },
      { status: 403 },
    );
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
