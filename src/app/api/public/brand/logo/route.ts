import { brandConfig } from "@/config/brand";
import { getPool } from "@/lib/db";
import { mediaExists, mediaUrl } from "@/lib/media-storage";
export async function GET(request: Request) {
  let target: string = brandConfig.logoSrc;
  try {
    if (process.env.DATABASE_URL) {
      const r = await getPool().query(
        `SELECT m.storage_key FROM brand_settings b JOIN media_assets m ON m.id=b.logo_asset_id WHERE b.id=1`,
      );
      if (r.rows[0] && (await mediaExists(r.rows[0].storage_key))) {
        target = mediaUrl(r.rows[0].storage_key);
      }
    }
  } catch (e) {
    console.error("Logo fallback:", e);
  }
  return Response.redirect(new URL(target, request.url), 307);
}
