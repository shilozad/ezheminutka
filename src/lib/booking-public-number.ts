import { randomBytes } from "node:crypto";
import type { LocationSlug } from "@/config/locations";

const prefixes: Record<LocationSlug, string> = { moscow: "MSK", spb: "SPB", kazan: "KZN" };
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function createBookingPublicNumber(location: LocationSlug): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts();
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "00";
  const suffix = Array.from(randomBytes(5), (byte) => alphabet[byte % alphabet.length]).join("");
  return `${prefixes[location]}-${part("year")}${part("month")}${part("day")}-${suffix}`;
}
