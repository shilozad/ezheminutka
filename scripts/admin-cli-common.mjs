import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import readline from "node:readline";
const derive = promisify(scrypt);
export function args() {
  const out = {};
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--password")
      throw new Error("Не передавайте пароль аргументом командной строки.");
    if (process.argv[i].startsWith("--")) out[process.argv[i].slice(2)] = process.argv[++i];
  }
  return out;
}
export async function password() {
  if (!process.stdin.isTTY)
    throw new Error("Для безопасного ввода пароля требуется интерактивный терминал.");
  process.stdout.write("Пароль: ");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  let value = "";
  return await new Promise((resolve, reject) =>
    process.stdin.on("data", function onData(chunk) {
      const c = chunk.toString();
      if (c === "\r" || c === "\n") {
        process.stdin.off("data", onData);
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write("\n");
        value.length >= 12
          ? resolve(value)
          : reject(new Error("Пароль должен содержать не менее 12 символов."));
      } else if (c === "\u0003") process.exit(130);
      else if (c === "\u007f") {
        value = value.slice(0, -1);
      } else value += c;
    }),
  );
}
export async function hash(value) {
  const salt = randomBytes(16),
    key = await derive(value, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$v1$16384$8$1$${salt.toString("base64url")}$${key.toString("base64url")}`;
}
export async function pool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL обязателен.");
  const { default: pg } = await import("pg");
  return new pg.Pool({ connectionString: process.env.DATABASE_URL });
}
