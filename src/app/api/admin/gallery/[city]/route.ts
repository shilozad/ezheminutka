import { canAccessLocation, getAdminContext } from "@/lib/admin-auth";
import { verifySameOrigin } from "@/lib/admin-origin";
import { getPool } from "@/lib/db";
import { isLocationSlug } from "@/config/locations";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const err = (message: string, status = 400) => Response.json({ error: { message } }, { status });
const validText = (x: unknown, min: number, max: number) =>
  typeof x === "string" && x.trim().length >= min && x.trim().length <= max;
async function access(request: Request, params: Promise<{ city: string }>) {
  if (!verifySameOrigin(request)) return { error: err("Недопустимый источник запроса.", 403) };
  const admin = await getAdminContext();
  if (!admin) return { error: err("Требуется вход.", 401) };
  const { city } = await params;
  if (!isLocationSlug(city)) return { error: err("Неизвестный город.", 404) };
  if (!canAccessLocation(admin, city)) return { error: err("Недостаточно прав.", 403) };
  return { admin, city };
}
export async function POST(request: Request, { params }: { params: Promise<{ city: string }> }) {
  try {
    const a = await access(request, params);
    if ("error" in a) return a.error;
    const body = await request.json();
    if (
      !uuid.test(body.mediaAssetId ?? "") ||
      !validText(body.title, 1, 140) ||
      !validText(body.altText, 1, 300) ||
      !(body.caption == null || validText(body.caption, 0, 400))
    )
      return err("Проверьте данные фотографии.");
    const pool = getPool(),
      asset = await pool.query(`SELECT id FROM media_assets WHERE id=$1 AND location_id=$2`, [
        body.mediaAssetId,
        a.city,
      ]);
    if (!asset.rowCount) return err("Изображение не принадлежит выбранному кафе.");
    const count = await pool.query(
      `SELECT COUNT(*)::int count,COALESCE(MAX(sort_order),0)::int last FROM gallery_items WHERE location_id=$1`,
      [a.city],
    );
    if (count.rows[0].count >= 60) return err("В галерее может быть не более 60 фотографий.");
    const id = crypto.randomUUID();
    await pool.query(
      `INSERT INTO gallery_items(id,location_id,media_asset_id,title,alt_text,caption,featured,sort_order,created_by_admin_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        id,
        a.city,
        body.mediaAssetId,
        body.title.trim(),
        body.altText.trim(),
        body.caption?.trim() || null,
        count.rows[0].count === 0,
        count.rows[0].last + 10,
        a.admin.id,
      ],
    );
    return Response.json(
      {
        item: {
          id,
          mediaAssetId: body.mediaAssetId,
          title: body.title.trim(),
          altText: body.altText.trim(),
          caption: body.caption?.trim() || null,
          featured: count.rows[0].count === 0,
          active: true,
          imageUrl: null,
        },
      },
      { status: 201 },
    );
  } catch {
    return err("Сервис временно недоступен.", 503);
  }
}
export async function PUT(request: Request, { params }: { params: Promise<{ city: string }> }) {
  const a = await access(request, params);
  if ("error" in a) return a.error;
  let items: any[];
  try {
    const body = await request.json();
    items = body.items;
    if (!Array.isArray(items) || items.length > 60) throw 0;
    const ids = new Set<string>();
    for (const x of items) {
      if (
        !validText(x.id, 1, 80) ||
        ids.has(x.id) ||
        !validText(x.title, 1, 140) ||
        !validText(x.altText, 1, 300) ||
        !(x.caption === null || validText(x.caption, 0, 400)) ||
        typeof x.active !== "boolean" ||
        typeof x.featured !== "boolean" ||
        !(x.mediaAssetId === null || uuid.test(x.mediaAssetId))
      )
        throw 0;
      ids.add(x.id);
    }
  } catch {
    return err("Проверьте данные и исключите повторяющиеся ID.");
  }
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const owned = await client.query(
      `SELECT id FROM gallery_items WHERE location_id=$1 AND id=ANY($2::varchar[])`,
      [a.city, items.map((x) => x.id)],
    );
    if (owned.rowCount !== items.length) {
      await client.query("ROLLBACK");
      return err("Элемент не принадлежит выбранному кафе.", 403);
    }
    const mediaIds = items.map((x) => x.mediaAssetId).filter(Boolean);
    if (mediaIds.length) {
      const assets = await client.query(
        `SELECT id FROM media_assets WHERE location_id=$1 AND id=ANY($2::uuid[])`,
        [a.city, mediaIds],
      );
      if (new Set(assets.rows.map((x) => x.id)).size !== new Set(mediaIds).size) {
        await client.query("ROLLBACK");
        return err("Изображение не принадлежит выбранному кафе.");
      }
    }
    for (let i = 0; i < items.length; i++) {
      const x = items[i];
      await client.query(
        `UPDATE gallery_items SET title=$1,alt_text=$2,caption=$3,active=$4,featured=$5,sort_order=$6,updated_at=NOW() WHERE id=$7 AND location_id=$8`,
        [
          x.title.trim(),
          x.altText.trim(),
          x.caption?.trim() || null,
          x.active,
          x.featured,
          (i + 1) * 10,
          x.id,
          a.city,
        ],
      );
    }
    await client.query("COMMIT");
    return Response.json({ ok: true });
  } catch {
    await client.query("ROLLBACK");
    return err("Не удалось сохранить галерею.", 503);
  } finally {
    client.release();
  }
}
