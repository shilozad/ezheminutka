import { getAdminContext, canAccessLocation } from "@/lib/admin-auth";
import { verifySameOrigin } from "@/lib/admin-origin";
import { getPool } from "@/lib/db";
import { isLocationSlug } from "@/config/locations";
import { amenityIconKeys } from "@/components/AmenityIcon";
const err = (message: string, status = 400) => Response.json({ error: { message } }, { status });
const text = (x: unknown, min: number, max: number, name: string) =>
  typeof x === "string" && x.trim().length >= min && x.trim().length <= max
    ? x.trim()
    : (() => {
        throw new Error(name);
      })();
export async function PUT(request: Request, { params }: { params: Promise<{ city: string }> }) {
  if (!verifySameOrigin(request)) return err("Недопустимый источник запроса.", 403);
  const admin = await getAdminContext();
  if (!admin) return err("Требуется вход.", 401);
  const { city } = await params;
  if (!isLocationSlug(city)) return err("Неизвестный город.", 404);
  if (!canAccessLocation(admin, city)) return err("Недостаточно прав.", 403);
  let body: any;
  try {
    body = await request.json();
    body.heroEyebrow = text(body.heroEyebrow, 0, 160, "надпись");
    body.heroTitle = text(body.heroTitle, 1, 240, "заголовок");
    body.heroDescription = text(body.heroDescription, 1, 600, "описание");
    body.amenitiesEyebrow = text(body.amenitiesEyebrow, 0, 160, "надпись блока");
    body.amenitiesTitle = text(body.amenitiesTitle, 1, 240, "заголовок блока");
    if (!Array.isArray(body.amenities) || body.amenities.length > 12) throw new Error("карточки");
    for (const a of body.amenities) {
      a.title = text(a.title, 1, 100, "карточка");
      a.description = text(a.description ?? "", 0, 250, "описание карточки");
      if (typeof a.id !== "string" || a.id.length > 80 || !amenityIconKeys.includes(a.iconKey))
        throw new Error("карточка");
    }
  } catch {
    return err("Проверьте длину полей и данные карточек.");
  }
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const ids = [body.heroAssetId, ...body.amenities.map((a: any) => a.backgroundAssetId)].filter(
      Boolean,
    );
    if (ids.length) {
      const assets = await client.query(
        `SELECT id FROM media_assets WHERE id=ANY($1::uuid[]) AND location_id=$2`,
        [ids, city],
      );
      if (new Set(assets.rows.map((x) => x.id)).size !== new Set(ids).size)
        throw new Error("ASSET");
    }
    await client.query(
      `INSERT INTO location_page_content(location_id,hero_eyebrow,hero_title,hero_description,hero_asset_id,amenities_eyebrow,amenities_title,updated_by_admin_id,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,NOW()) ON CONFLICT(location_id) DO UPDATE SET hero_eyebrow=$2,hero_title=$3,hero_description=$4,hero_asset_id=$5,amenities_eyebrow=$6,amenities_title=$7,updated_by_admin_id=$8,updated_at=NOW()`,
      [
        city,
        body.heroEyebrow,
        body.heroTitle,
        body.heroDescription,
        body.heroAssetId || null,
        body.amenitiesEyebrow,
        body.amenitiesTitle,
        admin.id,
      ],
    );
    const keep = [];
    for (let i = 0; i < body.amenities.length; i++) {
      const a = body.amenities[i],
        id = a.id.startsWith("new-") ? crypto.randomUUID() : a.id;
      keep.push(id);
      await client.query(
        `INSERT INTO location_amenities(id,location_id,title,description,icon_key,background_asset_id,sort_order,active) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(id) DO UPDATE SET title=$3,description=$4,icon_key=$5,background_asset_id=$6,sort_order=$7,active=$8,updated_at=NOW() WHERE location_amenities.location_id=$2`,
        [
          id,
          city,
          a.title,
          a.description,
          a.iconKey,
          a.backgroundAssetId || null,
          (i + 1) * 10,
          Boolean(a.active),
        ],
      );
    }
    await client.query(
      `DELETE FROM location_amenities WHERE location_id=$1 AND NOT(id=ANY($2::varchar[]))`,
      [city, keep],
    );
    await client.query("COMMIT");
    return Response.json({ ok: true });
  } catch (e) {
    await client.query("ROLLBACK");
    return err(
      e instanceof Error && e.message === "ASSET"
        ? "Изображение не принадлежит выбранному кафе."
        : "Не удалось сохранить изменения.",
      e instanceof Error && e.message === "ASSET" ? 400 : 503,
    );
  } finally {
    client.release();
  }
}
