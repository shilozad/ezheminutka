import { readMedia } from "@/lib/media-storage";
const types: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};
async function response(params: Promise<{ path: string[] }>, head = false) {
  const parts = (await params).path;
  const ext = parts.at(-1)?.split(".").at(-1)?.toLowerCase();
  if (
    !parts.length ||
    !ext ||
    !types[ext] ||
    parts.some((x) => !x || x === ".." || x.includes("\\"))
  )
    return new Response(null, { status: 404 });
  try {
    const bytes = await readMedia(parts.join("/"));
    if (!bytes) return new Response(null, { status: 404 });
    return new Response(head ? null : bytes, {
      headers: {
        "Content-Type": types[ext],
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
export function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return response(params);
}
export function HEAD(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return response(params, true);
}
