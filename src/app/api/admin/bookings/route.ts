import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { DatabaseError } from "pg";
import { getAdminContext, canAccessLocation } from "@/lib/admin-auth";
import { verifySameOrigin } from "@/lib/admin-origin";
import { validateBookingFields } from "@/lib/booking-validation";
import { createBookingPublicNumber } from "@/lib/booking-public-number";
import { getPool } from "@/lib/db";
const fail = (m: string, s: number) =>
  NextResponse.json({ ok: false, error: { message: m } }, { status: s });
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) return fail("Запрос отклонён.", 403);
  let admin;
  try {
    admin = await getAdminContext();
  } catch (e) {
    console.error(e);
    return fail("Сервис временно недоступен.", 503);
  }
  if (!admin) return fail("Требуется вход.", 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Проверьте данные формы.", 400);
  }
  const validation = validateBookingFields(body);
  if (!validation.ok) return fail(validation.message, 422);
  const b = validation.value;
  if (!canAccessLocation(admin, b.locationId)) return fail("Недостаточно прав.", 403);
  const input = body as Record<string, unknown>;
  const status = typeof input.status === "string" ? input.status : "NEW";
  if (!["NEW", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status))
    return fail("Неизвестный статус.", 422);
  const note = typeof input.adminNote === "string" ? input.adminNote.trim() : null;
  if (note && note.length > 2000) return fail("Заметка слишком длинная.", 422);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const number = createBookingPublicNumber(b.locationId);
    try {
      await getPool().query(
        `INSERT INTO bookings(id,public_number,location_id,full_name,phone,visit_date,visit_time,guest_count,visit_type,comment,status,admin_note,consent_at,source,created_by_admin_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NULL,'ADMIN',$13)`,
        [
          randomUUID(),
          number,
          b.locationId,
          b.fullName,
          b.phone,
          b.visitDate,
          b.visitTime,
          b.guestCount,
          b.visitType,
          b.comment,
          status,
          note,
          admin.id,
        ],
      );
      return NextResponse.json({ ok: true, booking: { publicNumber: number } }, { status: 201 });
    } catch (error) {
      const databaseError = error as DatabaseError;
      if (
        databaseError.code === "23505" &&
        databaseError.constraint === "bookings_public_number_key"
      )
        continue;
      console.error("Admin booking create failed", error);
      return fail("Сервис временно недоступен.", 503);
    }
  }
  console.error("Could not generate a unique admin booking public number");
  return fail("Сервис временно недоступен.", 503);
}
