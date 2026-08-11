import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CityGallery } from "@/components/CityGallery";
import { getLocation, isLocationSlug, locationStaticParams } from "@/config/locations";
import { getPublicGallery } from "@/lib/public-gallery";
type Props = { params: Promise<{ city: string }> };
export const generateStaticParams = locationStaticParams;
export default async function Page({ params }: Props) {
  const { city } = await params;
  if (!isLocationSlug(city)) return notFound();
  await connection();
  return <CityGallery location={getLocation(city)} items={await getPublicGallery(city)} />;
}
