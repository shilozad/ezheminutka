import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import type { DatabaseError } from "pg";
import { validateBooking } from "@/lib/booking-validation";
import { getPool } from "@/lib/db";
import { requestIp, takeBookingRateLimit } from "@/lib/rate-limit";
import { createBookingPublicNumber } from "@/lib/booking-public-number";

export const runtime = "nodejs";

function response(message: string, status: number) {
  return NextResponse.json({ ok: false, error: { message } }, { status });
}

export async function POST(request: NextRequest) {
  if (process.env.BOOKING_ENABLED !== "true") {
    return response("Онлайн-бронирование скоро будет доступно.", 503);
  }
  if (!process.env.DATABASE_URL) {
    return response("Онлайн-бронирование временно недоступно. Свяжитесь с кафе по телефону.", 503);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return response("Отправьте данные в формате JSON.", 415);
  }
  if (!takeBookingRateLimit(requestIp(request.headers))) {
    return response("Слишком много попыток. Попробуйте снова через минуту.", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return response("Не удалось прочитать данные формы.", 400);
  }
  const validation = validateBooking(body);
  if (!validation.ok) return response(validation.message, validation.honeypot ? 400 : 422);

  const booking = validation.value;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const number = createBookingPublicNumber(booking.locationId);
    try {
      await getPool().query(
        `INSERT INTO bookings
          (id, public_number, location_id, full_name, phone, visit_date, visit_time,
           guest_count, visit_type, comment, consent_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
        [
          randomUUID(),
          number,
          booking.locationId,
          booking.fullName,
          booking.phone,
          booking.visitDate,
          booking.visitTime,
          booking.guestCount,
          booking.visitType,
          booking.comment,
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
      console.error("Booking insert failed", error);
      return response(
        "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с кафе по телефону.",
        503,
      );
    }
  }

  console.error("Could not generate a unique booking public number");
  return response(
    "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с кафе по телефону.",
    503,
  );
}
