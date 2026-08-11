import "server-only";
import path from "node:path";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
export const MAX_MEDIA_BYTES = 8 * 1024 * 1024;
export function uploadsEnabled() {
  return process.env.MEDIA_UPLOAD_ENABLED === "true" && Boolean(process.env.UPLOAD_DIR);
}
export function resolveStoragePath(key: string) {
  const rootValue = process.env.UPLOAD_DIR;
  if (!rootValue || path.isAbsolute(key) || key.includes("\\") || key.split("/").includes(".."))
    return null;
  const root = path.resolve(rootValue),
    result = path.resolve(root, key);
  return result.startsWith(`${root}${path.sep}`) ? result : null;
}
export async function saveMedia(key: string, bytes: Uint8Array) {
  const target = resolveStoragePath(key);
  if (!target) throw new Error("Storage unavailable");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
}
export async function deleteMedia(key: string) {
  const target = resolveStoragePath(key);
  if (!target) return;
  await unlink(target).catch(() => undefined);
}
export async function readMedia(key: string) {
  const target = resolveStoragePath(key);
  return target ? readFile(target) : null;
}
export function mediaUrl(key: string) {
  return `/uploads/${key.split("/").map(encodeURIComponent).join("/")}`;
}
export function detectImage(bytes: Uint8Array): { mime: string; extension: string } | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return { mime: "image/jpeg", extension: "jpg" };
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((x, i) => bytes[i] === x))
    return { mime: "image/png", extension: "png" };
  if (
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  )
    return { mime: "image/webp", extension: "webp" };
  return null;
}
