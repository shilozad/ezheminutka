import { getAdminContext, canAccessLocation } from "@/lib/admin-auth";
import { verifySameOrigin } from "@/lib/admin-origin";
import { getPool } from "@/lib/db";
import { deleteMedia, uploadsEnabled } from "@/lib/media-storage";
const err = (message: string, status: number) => Response.json({ error: { message } }, { status });
async function deleteMediaAsset(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifySameOrigin(request)) return err("Недопустимый источник запроса.", 403);
  const admin = await getAdminContext();
  if (!admin) return err("Требуется вход.", 401);
  if (!uploadsEnabled()) return err("Удаление изображений отключено.", 503);
  const { id } = await params,
    pool = getPool(),
    found = await pool.query(`SELECT * FROM media_assets WHERE id=$1`, [id]),
    asset = found.rows[0];
  if (!asset) return err("Изображение не найдено.", 404);
  if (
    asset.location_id === null
      ? admin.role !== "SUPERADMIN"
      : !canAccessLocation(admin, asset.location_id)
  )
    return err("Недостаточно прав.", 403);
  const used = await pool.query(
    `SELECT EXISTS(SELECT 1 FROM brand_settings WHERE logo_asset_id=$1) OR EXISTS(SELECT 1 FROM location_page_content WHERE hero_asset_id=$1) OR EXISTS(SELECT 1 FROM location_amenities WHERE background_asset_id=$1) used`,
    [id],
  );
  if (used.rows[0].used) return err("Сначала уберите изображение из блока сайта.", 409);
  await pool.query(`DELETE FROM media_assets WHERE id=$1`, [id]);
  await deleteMedia(asset.storage_key);
  return new Response(null, { status: 204 });
}

export async function DELETE(...args: Parameters<typeof deleteMediaAsset>) {
  try {
    return await deleteMediaAsset(...args);
  } catch {
    return Response.json({ error: { message: "Сервис временно недоступен." } }, { status: 503 });
  }
}
