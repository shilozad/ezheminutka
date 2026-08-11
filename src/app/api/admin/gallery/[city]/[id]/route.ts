import { canAccessLocation, getAdminContext } from "@/lib/admin-auth";
import { verifySameOrigin } from "@/lib/admin-origin";
import { getPool } from "@/lib/db";
import { isLocationSlug } from "@/config/locations";
const err = (message: string, status: number) => Response.json({ error: { message } }, { status });
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ city: string; id: string }> },
) {
  try {
    if (!verifySameOrigin(request)) return err("Недопустимый источник запроса.", 403);
    const admin = await getAdminContext();
    if (!admin) return err("Требуется вход.", 401);
    const { city, id } = await params;
    if (!isLocationSlug(city)) return err("Неизвестный город.", 404);
    if (!canAccessLocation(admin, city)) return err("Недостаточно прав.", 403);
    const result = await getPool().query(
      `DELETE FROM gallery_items WHERE id=$1 AND location_id=$2 RETURNING media_asset_id`,
      [id, city],
    );
    if (!result.rowCount) return err("Фотография не найдена.", 404);
    return Response.json({ mediaAssetId: result.rows[0].media_asset_id });
  } catch {
    return err("Сервис временно недоступен.", 503);
  }
}
