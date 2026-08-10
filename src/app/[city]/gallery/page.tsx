import { notFound } from "next/navigation";
import { CityGallery } from "@/components/CityGallery";
import { getLocation, isLocationSlug, locationStaticParams } from "@/config/locations";
import { mediaByLocation } from "@/config/media";
type Props = { params: Promise<{ city: string }> };
export const generateStaticParams = locationStaticParams;
export default async function Page({ params }: Props) {
  const { city } = await params;
  if (!isLocationSlug(city)) return notFound();
  return <CityGallery location={getLocation(city)} media={mediaByLocation[city]} />;
}
