import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin-auth";
import { getLocationPresentation } from "@/lib/public-content";
import AppearanceEditor from "@/components/admin/AppearanceEditor";
import { getPool } from "@/lib/db";
import { mediaUrl, uploadsEnabled } from "@/lib/media-storage";
export const dynamic = "force-dynamic";
export default async function Page() {
  let admin;
  try {
    admin = await getAdminContext();
  } catch {
    redirect("/admin/login");
  }
  if (!admin) redirect("/admin/login");
  const presentations = Object.fromEntries(
    await Promise.all(
      admin.allowedLocations.map(async (city) => [city, await getLocationPresentation(city, true)]),
    ),
  );
  let logo = null;
  try {
    if (admin.role === "SUPERADMIN" && process.env.DATABASE_URL) {
      const r = await getPool().query(
        `SELECT m.id,m.storage_key FROM brand_settings b JOIN media_assets m ON m.id=b.logo_asset_id WHERE b.id=1`,
      );
      if (r.rows[0]) logo = { id: r.rows[0].id, url: mediaUrl(r.rows[0].storage_key) };
    }
  } catch {}
  return (
    <AppearanceEditor
      admin={admin}
      initial={presentations}
      initialLogo={logo}
      uploadEnabled={uploadsEnabled()}
    />
  );
}
