import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin-auth";
import { getAdminGallery } from "@/lib/admin-gallery";
import { uploadsEnabled } from "@/lib/media-storage";
import GalleryEditor from "@/components/admin/GalleryEditor";
export const dynamic = "force-dynamic";
export default async function Page() {
  let admin;
  try {
    admin = await getAdminContext();
  } catch {
    redirect("/admin/login");
  }
  if (!admin) redirect("/admin/login");
  const initial = Object.fromEntries(
    await Promise.all(
      admin.allowedLocations.map(async (city) => [city, await getAdminGallery(admin, city)]),
    ),
  );
  return <GalleryEditor admin={admin} initial={initial} uploadEnabled={uploadsEnabled()} />;
}
