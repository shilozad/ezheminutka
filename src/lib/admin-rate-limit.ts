const attempts = new Map<string, { count: number; reset: number }>();
const MAX_ENTRIES = 2_000;
export function takeAdminLoginAttempt(key: string) {
  const now = Date.now();
  if (!attempts.has(key) && attempts.size >= MAX_ENTRIES) {
    for (const [k, v] of attempts) if (v.reset <= now) attempts.delete(k);
    if (attempts.size >= MAX_ENTRIES) attempts.delete(attempts.keys().next().value!);
  }
  const item = attempts.get(key);
  if (!item || item.reset <= now) {
    attempts.set(key, { count: 1, reset: now + 600000 });
    return true;
  }
  if (item.count >= 10) return false;
  item.count++;
  return true;
}
