import { isLocationSlug, type LocationSlug } from "@/config/locations";
import { servicesByLocation, type ServiceId } from "@/content/services";

export type BookingInput = {
  locationId: LocationSlug;
  fullName: string;
  phone: string;
  visitDate: string;
  visitTime: string;
  guestCount: number;
  visitType: ServiceId;
  comment: string | null;
};

type ValidationResult =
  { ok: true; value: BookingInput } | { ok: false; message: string; honeypot?: boolean };

const timeZones: Record<LocationSlug, string> = {
  moscow: "Europe/Moscow",
  spb: "Europe/Moscow",
  kazan: "Europe/Moscow",
};

function textField(value: unknown): string | null {
  return typeof value === "string" ? value.trim() : null;
}

function calendarDateFor(location: LocationSlug): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZones[location],
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts();
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function validateBookingFields(
  body: unknown,
  { allowPastDate = false }: { allowPastDate?: boolean } = {},
): ValidationResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, message: "Проверьте данные формы." };
  }

  const input = body as Record<string, unknown>;
  if (typeof input.locationId !== "string" || !isLocationSlug(input.locationId)) {
    return { ok: false, message: "Выбран неизвестный город." };
  }
  const locationId = input.locationId;
  const fullName = textField(input.fullName);
  if (!fullName || fullName.length < 2 || fullName.length > 120) {
    return { ok: false, message: "Укажите ФИО длиной от 2 до 120 символов." };
  }

  const rawPhone = textField(input.phone);
  const digits = rawPhone?.replace(/\D/g, "") ?? "";
  if (digits.length < 10 || digits.length > 15) {
    return { ok: false, message: "Укажите корректный номер телефона." };
  }
  const phone = rawPhone?.startsWith("+") ? `+${digits}` : digits;

  const visitDate = textField(input.visitDate);
  if (!visitDate || !/^\d{4}-\d{2}-\d{2}$/.test(visitDate)) {
    return { ok: false, message: "Укажите корректную дату посещения." };
  }
  const [year, month, day] = visitDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    (!allowPastDate && visitDate < calendarDateFor(locationId))
  ) {
    return { ok: false, message: "Дата посещения не может быть в прошлом." };
  }

  const visitTime = textField(input.visitTime);
  if (!visitTime || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(visitTime)) {
    return { ok: false, message: "Укажите корректное время посещения." };
  }
  const guestCount =
    typeof input.guestCount === "number" ? input.guestCount : Number(input.guestCount);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 50) {
    return { ok: false, message: "Количество гостей должно быть от 1 до 50." };
  }

  const service = servicesByLocation[locationId].find(({ id }) => id === input.visitType);
  if (!service?.enabled) {
    return { ok: false, message: "Выбранный формат недоступен в этом кафе." };
  }
  const comment = textField(input.comment);
  if (comment && comment.length > 1000) {
    return { ok: false, message: "Комментарий не должен превышать 1000 символов." };
  }
  return {
    ok: true,
    value: {
      locationId,
      fullName,
      phone,
      visitDate,
      visitTime,
      guestCount,
      visitType: service.id,
      comment: comment || null,
    },
  };
}

export function validateBooking(body: unknown): ValidationResult {
  if (body && typeof body === "object" && !Array.isArray(body)) {
    const input = body as Record<string, unknown>;
    if (textField(input.website))
      return { ok: false, message: "Не удалось отправить заявку.", honeypot: true };
    if (input.consent !== true)
      return { ok: false, message: "Необходимо согласие на обработку персональных данных." };
  }
  return validateBookingFields(body);
}
