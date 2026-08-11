import { randomUUID } from "node:crypto";
import { getAdminContext, canAccessLocation } from "@/lib/admin-auth";
import { verifySameOrigin } from "@/lib/admin-origin";
import { getPool } from "@/lib/db";
import {
  MAX_MEDIA_BYTES,
  detectImage,
  saveMedia,
  deleteMedia,
  mediaUrl,
  uploadsEnabled,
} from "@/lib/media-storage";
import { isLocationSlug } from "@/config/locations";
const error = (message: string, status: number) =>
  Response.json({ error: { message } }, { status });
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) return error("Недопустимый источник запроса.", 403);
  const admin = await getAdminContext();
  if (!admin) return error("Требуется вход.", 401);
  if (!uploadsEnabled()) return error("Загрузка изображений отключена.", 503);
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_MEDIA_BYTES + 100_000) return error("Файл больше 8 МБ.", 413);
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data"))
    return error("Ожидается файл.", 415);
  const form = await request.formData(),
    file = form.get("file"),
    rawLocation = form.get("locationId"),
    location = typeof rawLocation === "string" && rawLocation ? rawLocation : null;
  if (!(file instanceof File)) return error("Выберите файл.", 400);
  if (file.size <= 0 || file.size > MAX_MEDIA_BYTES)
    return error("Допустимый размер файла — до 8 МБ.", 413);
  if (location !== null && !isLocationSlug(location)) return error("Неизвестный город.", 400);
  if (
    (location === null && admin.role !== "SUPERADMIN") ||
    (location !== null && !canAccessLocation(admin, location))
  )
    return error("Недостаточно прав.", 403);
  const bytes = new Uint8Array(await file.arrayBuffer()),
    kind = detectImage(bytes);
  if (!kind || file.type !== kind.mime)
    return error("Разрешены только настоящие JPEG, PNG и WebP.", 415);
  const id = randomUUID(),
    key = `${location ?? "brand"}/${id}.${kind.extension}`;
  await saveMedia(key, bytes);
  try {
    const result = await getPool().query(
      `INSERT INTO media_assets(id,location_id,storage_key,original_name,mime_type,byte_size,created_by_admin_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [id, location, key, file.name.slice(0, 255), kind.mime, file.size, admin.id],
    );
    return Response.json(
      {
        asset: {
          id,
          locationId: location,
          url: mediaUrl(key),
          mimeType: kind.mime,
          byteSize: file.size,
          originalName: result.rows[0].original_name,
        },
      },
      { status: 201 },
    );
  } catch {
    await deleteMedia(key);
    return error("Не удалось сохранить изображение.", 503);
  }
}
