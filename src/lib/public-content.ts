import "server-only";
import type { LocationSlug } from "@/config/locations";
import { getLocation } from "@/config/locations";
import { mediaByLocation } from "@/config/media";
import { defaultAmenities, type AmenityPresentation } from "@/content/amenities";
import { getPool } from "@/lib/db";
import { mediaUrl } from "@/lib/media-storage";
export type LocationPresentation = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string | null;
  heroAssetId: string | null;
  amenitiesEyebrow: string;
  amenitiesTitle: string;
  amenities: AmenityPresentation[];
};
export function fallbackPresentation(city: LocationSlug): LocationPresentation {
  const location = getLocation(city);
  return {
    heroEyebrow: "Необычная пауза в большом городе",
    heroTitle: location.heroTitle,
    heroDescription: location.description,
    heroImage: mediaByLocation[city].hero,
    heroAssetId: null,
    amenitiesEyebrow: "Внутри",
    amenitiesTitle: "Что есть в «Ежеминутке»",
    amenities: defaultAmenities,
  };
}
export async function getLocationPresentation(
  city: LocationSlug,
  includeInactive = false,
): Promise<LocationPresentation> {
  const fallback = fallbackPresentation(city);
  if (!process.env.DATABASE_URL) return fallback;
  try {
    const [content, cards] = await Promise.all([
      getPool().query(
        `SELECT c.*,m.storage_key hero_key FROM location_page_content c LEFT JOIN media_assets m ON m.id=c.hero_asset_id WHERE c.location_id=$1`,
        [city],
      ),
      getPool().query(
        `SELECT a.*,m.storage_key background_key FROM location_amenities a LEFT JOIN media_assets m ON m.id=a.background_asset_id WHERE a.location_id=$1 ${includeInactive ? "" : "AND a.active=TRUE"} ORDER BY a.sort_order,a.id`,
        [city],
      ),
    ]);
    const c = content.rows[0];
    return {
      heroEyebrow: c?.hero_eyebrow ?? fallback.heroEyebrow,
      heroTitle: c?.hero_title ?? fallback.heroTitle,
      heroDescription: c?.hero_description ?? fallback.heroDescription,
      heroImage: c?.hero_key ? mediaUrl(c.hero_key) : fallback.heroImage,
      heroAssetId: c?.hero_asset_id ?? null,
      amenitiesEyebrow: c?.amenities_eyebrow ?? fallback.amenitiesEyebrow,
      amenitiesTitle: c?.amenities_title ?? fallback.amenitiesTitle,
      amenities: cards.rows.length
        ? cards.rows.map((a) => ({
            id: a.id,
            title: a.title,
            description: a.description,
            iconKey: a.icon_key ?? "none",
            backgroundAssetId: a.background_asset_id,
            backgroundUrl: a.background_key ? mediaUrl(a.background_key) : null,
            active: a.active,
          }))
        : fallback.amenities,
    };
  } catch (error) {
    console.error("Public content fallback:", error);
    return fallback;
  }
}
