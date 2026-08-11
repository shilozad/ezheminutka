import { getAdminContext } from "@/lib/admin-auth";
import { verifySameOrigin } from "@/lib/admin-origin";
import { getPool } from "@/lib/db";
const err = (message: string, status: number) => Response.json({ error: { message } }, { status });
async function updateBrand(request: Request) {
  if (!verifySameOrigin(request)) return err("Недопустимый источник запроса.", 403);
  const admin = await getAdminContext();
  if (!admin) return err("Требуется вход.", 401);
  if (admin.role !== "SUPERADMIN") return err("Недостаточно прав.", 403);
  const { logoAssetId } = await request.json();
  if (logoAssetId !== null && typeof logoAssetId !== "string")
    return err("Некорректное изображение.", 400);
  if (logoAssetId) {
    const asset = await getPool().query(
      `SELECT 1 FROM media_assets WHERE id=$1 AND location_id IS NULL`,
      [logoAssetId],
    );
    if (!asset.rowCount) return err("Для логотипа нужно глобальное изображение.", 400);
  }
  await getPool().query(
    `UPDATE brand_settings SET logo_asset_id=$1,updated_by_admin_id=$2,updated_at=NOW() WHERE id=1`,
    [logoAssetId, admin.id],
  );
  return Response.json({ ok: true });
}

export async function PUT(...args: Parameters<typeof updateBrand>) {
  try {
    return await updateBrand(...args);
  } catch {
    return Response.json({ error: { message: "Сервис временно недоступен." } }, { status: 503 });
  }
}
