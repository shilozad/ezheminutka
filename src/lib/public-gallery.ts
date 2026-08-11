import "server-only";
import type { LocationSlug } from "@/config/locations";
import { mediaByLocation } from "@/config/media";
import { getPool } from "@/lib/db";
import { mediaExists, mediaUrl } from "@/lib/media-storage";

export type PublicGalleryItem = {
  id: string;
  title: string;
  altText: string;
  caption: string | null;
  imageUrl: string | null;
  mediaAssetId: string | null;
  featured: boolean;
};
const labels = [
  "Интерьер — общий план",
  "Зона отдыха",
  "Знакомство с ёжиками",
  "Африканский ёжик",
  "Праздник в кафе",
  "Событие в Ежеминутке",
];
const keys = ["interior1", "interior2", "hedgehog1", "hedgehog2", "event1", "event2"] as const;
export function fallbackGallery(city: LocationSlug): PublicGalleryItem[] {
  return labels.map((title, i) => ({
    id: `fallback-${city}-${i + 1}`,
    title,
    altText: title,
    caption: null,
    imageUrl: mediaByLocation[city][keys[i]],
    mediaAssetId: null,
    featured: i === 0,
  }));
}
export async function getPublicGallery(
  city: LocationSlug,
  includeInactive = false,
): Promise<PublicGalleryItem[]> {
  if (!process.env.DATABASE_URL) return fallbackGallery(city);
  try {
    const result = await getPool().query(
      `SELECT g.*,m.storage_key FROM gallery_items g LEFT JOIN media_assets m ON m.id=g.media_asset_id WHERE g.location_id=$1 ${includeInactive ? "" : "AND g.active=TRUE"} ORDER BY g.sort_order,g.id`,
      [city],
    );
    return Promise.all(
      result.rows.map(async (row) => ({
        id: row.id,
        title: row.title,
        altText: row.alt_text,
        caption: row.caption,
        imageUrl:
          row.storage_key && (await mediaExists(row.storage_key))
            ? mediaUrl(row.storage_key)
            : null,
        mediaAssetId: row.media_asset_id,
        featured: row.featured,
      })),
    );
  } catch (error) {
    console.error("Public gallery fallback:", error);
    return fallbackGallery(city);
  }
}
