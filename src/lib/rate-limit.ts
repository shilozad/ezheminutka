const WINDOW_MS = 60_000;
const LIMIT = 5;
const MAX_ENTRIES = 5_000;
const attempts = new Map<string, number[]>();

export function takeBookingRateLimit(ip: string): boolean {
  const now = Date.now();
  if (attempts.size >= MAX_ENTRIES) {
    for (const [key, timestamps] of attempts) {
      if (!timestamps.some((timestamp) => timestamp > now - WINDOW_MS)) attempts.delete(key);
    }
    if (attempts.size >= MAX_ENTRIES) attempts.delete(attempts.keys().next().value as string);
  }

  const recent = (attempts.get(ip) ?? []).filter((timestamp) => timestamp > now - WINDOW_MS);
  if (recent.length >= LIMIT) {
    attempts.set(ip, recent);
    return false;
  }
  recent.push(now);
  attempts.set(ip, recent);
  return true;
}

export function requestIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown"
  );
}
