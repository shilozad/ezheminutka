const attempts = new Map<string, { count: number; reset: number }>();
export function takeAdminLoginAttempt(key: string) {
  const now = Date.now();
  if (attempts.size > 1000) for (const [k, v] of attempts) if (v.reset <= now) attempts.delete(k);
  const item = attempts.get(key);
  if (!item || item.reset <= now) {
    attempts.set(key, { count: 1, reset: now + 600000 });
    return true;
  }
  if (item.count >= 10) return false;
  item.count++;
  return true;
}
