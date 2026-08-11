import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
const derive = (
  password: string,
  salt: Buffer,
  size: number,
  options: { N: number; r: number; p: number },
) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, size, options, (error, key) => (error ? reject(error) : resolve(key))),
  );
const N = 16384,
  r = 8,
  p = 1,
  length = 64;

export async function hashAdminPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, length, { N, r, p });
  return `scrypt$v1$${N}$${r}$${p}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyAdminPassword(password: string, encoded: string): Promise<boolean> {
  try {
    const [algorithm, version, n, block, parallel, saltText, hashText] = encoded.split("$");
    if (algorithm !== "scrypt" || version !== "v1") return false;
    const expected = Buffer.from(hashText, "base64url");
    const actual = await derive(password, Buffer.from(saltText, "base64url"), expected.length, {
      N: Number(n),
      r: Number(block),
      p: Number(parallel),
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
