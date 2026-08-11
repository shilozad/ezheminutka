import "server-only";
import type { LocationSlug } from "@/config/locations";
import { canAccessLocation, type AdminContext } from "@/lib/admin-auth";
import { getPublicGallery, type PublicGalleryItem } from "@/lib/public-gallery";

export type AdminGalleryItem = PublicGalleryItem & { active: boolean };
export async function getAdminGallery(
  admin: AdminContext,
  city: LocationSlug,
): Promise<AdminGalleryItem[]> {
  if (!canAccessLocation(admin, city)) throw new Error("FORBIDDEN");
  const items = await getPublicGallery(city, true);
  if (!process.env.DATABASE_URL) return items.map((x) => ({ ...x, active: true }));
  const { getPool } = await import("@/lib/db");
  const active = await getPool().query(`SELECT id,active FROM gallery_items WHERE location_id=$1`, [
    city,
  ]);
  const map = new Map(active.rows.map((x) => [x.id, x.active]));
  return items.map((x) => ({ ...x, active: map.get(x.id) ?? true }));
}
