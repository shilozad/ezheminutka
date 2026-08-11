import { NextResponse } from "next/server";
import { getAdminContext, canAccessLocation } from "@/lib/admin-auth";
import { verifySameOrigin } from "@/lib/admin-origin";
import { validateBookingFields } from "@/lib/booking-validation";
import { getPool } from "@/lib/db";
const fail = (m: string, s: number) =>
  NextResponse.json({ ok: false, error: { message: m } }, { status: s });
async function access(request: Request, id: string) {
  if (!verifySameOrigin(request)) return { error: fail("Запрос отклонён.", 403) };
  const admin = await getAdminContext();
  if (!admin) return { error: fail("Требуется вход.", 401) };
  const found = await getPool().query("SELECT location_id FROM bookings WHERE id=$1", [id]);
  if (!found.rows[0]) return { error: fail("Бронь не найдена.", 404) };
  if (!canAccessLocation(admin, found.rows[0].location_id))
    return { error: fail("Недостаточно прав.", 403) };
  return { admin };
}
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await access(request, id);
    if (auth.error) return auth.error;
    let body;
    try {
      body = await request.json();
    } catch {
      return fail("Проверьте данные формы.", 400);
    }
    const valid = validateBookingFields(body);
    if (!valid.ok) return fail(valid.message, 422);
    const b = valid.value;
    if (!canAccessLocation(auth.admin!, b.locationId)) return fail("Недостаточно прав.", 403);
    const input = body as Record<string, unknown>,
      status = input.status,
      note = typeof input.adminNote === "string" ? input.adminNote.trim() : null;
    if (
      !["NEW", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(String(status)) ||
      (note && note.length > 2000)
    )
      return fail("Проверьте статус и заметку.", 422);
    await getPool().query(
      `UPDATE bookings SET location_id=$2,full_name=$3,phone=$4,visit_date=$5,visit_time=$6,guest_count=$7,visit_type=$8,comment=$9,status=$10,admin_note=$11,updated_at=NOW() WHERE id=$1`,
      [
        id,
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
      ],
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Admin booking update failed", e);
    return fail("Сервис временно недоступен.", 503);
  }
}
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await access(request, id);
    if (auth.error) return auth.error;
    await getPool().query("DELETE FROM bookings WHERE id=$1", [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Admin booking delete failed", e);
    return fail("Сервис временно недоступен.", 503);
  }
}
