import "server-only";
import path from "node:path";
import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
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
  if (!target) throw new Error("Storage unavailable");
  try {
    await unlink(target);
  } catch (error) {
    if (isFileSystemError(error) && error.code === "ENOENT") return;
    throw error;
  }
}
export async function mediaExists(key: string) {
  const target = resolveStoragePath(key);
  if (!target) return false;
  try {
    return (await stat(target)).isFile();
  } catch {
    return false;
  }
}
export async function readMedia(key: string) {
  const target = resolveStoragePath(key);
  return target ? readFile(target) : null;
}
export function mediaUrl(key: string) {
  return `/uploads/${key.split("/").map(encodeURIComponent).join("/")}`;
}
export function detectImage(bytes: Uint8Array): { mime: string; extension: string } | null {
  if (
    bytes.length >= 16 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff &&
    bytes.at(-2) === 0xff &&
    bytes.at(-1) === 0xd9
  )
    return { mime: "image/jpeg", extension: "jpg" };
  if (
    bytes.length >= 45 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every((x, i) => bytes[i] === x) &&
    readUint32BE(bytes, 8) === 13 &&
    ascii(bytes, 12, 16) === "IHDR" &&
    readUint32BE(bytes, bytes.length - 12) === 0 &&
    ascii(bytes, bytes.length - 8, bytes.length - 4) === "IEND"
  )
    return { mime: "image/png", extension: "png" };
  if (
    bytes.length >= 20 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    ascii(bytes, 8, 12) === "WEBP" &&
    readUint32LE(bytes, 4) + 8 === bytes.length &&
    ["VP8 ", "VP8L", "VP8X"].includes(ascii(bytes, 12, 16))
  )
    return { mime: "image/webp", extension: "webp" };
  return null;
}

function ascii(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.slice(start, end));
}

function readUint32BE(bytes: Uint8Array, offset: number) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, false);
}

function readUint32LE(bytes: Uint8Array, offset: number) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, true);
}

function isFileSystemError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
