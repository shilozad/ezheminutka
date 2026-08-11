import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifySameOrigin } from "@/lib/admin-origin";
import { verifyAdminPassword, hashAdminPassword } from "@/lib/admin-password";
import { setAdminSession } from "@/lib/admin-session";
import { takeAdminLoginAttempt } from "@/lib/admin-rate-limit";
import { requestIp } from "@/lib/rate-limit";
export const runtime = "nodejs";
let dummyHash: Promise<string> | undefined;
const fail = (message: string, status: number) =>
  NextResponse.json({ ok: false, error: { message } }, { status });
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
    return fail("Отправьте данные в формате JSON.", 415);
  if (!verifySameOrigin(request)) return fail("Запрос отклонён.", 403);
  if (!takeAdminLoginAttempt(requestIp(request.headers)))
    return fail("Слишком много попыток. Попробуйте позже.", 429);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Неверные данные для входа", 401);
  }
  const value = body as Record<string, unknown>,
    username = typeof value?.username === "string" ? value.username.trim().toLowerCase() : "",
    password = typeof value?.password === "string" ? value.password : "";
  if (!process.env.DATABASE_URL || !process.env.ADMIN_SESSION_SECRET)
    return fail("Сервис временно недоступен.", 503);
  try {
    const result = await getPool().query(
      "SELECT id,password_hash,session_version FROM admin_users WHERE username=$1 AND active=TRUE",
      [username],
    );
    const user = result.rows[0];
    dummyHash ||= hashAdminPassword("invalid-password-placeholder");
    const valid = await verifyAdminPassword(password, user?.password_hash ?? (await dummyHash));
    if (!user || !valid) return fail("Неверные данные для входа", 401);
    await setAdminSession(user.id, user.session_version);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login failed", error);
    return fail("Сервис временно недоступен.", 503);
  }
}
