import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityLanding } from "@/components/CityLanding";
import { getLocation, isLocationSlug, locationStaticParams } from "@/config/locations";
import { mediaByLocation } from "@/config/media";
import { tariffsByLocation } from "@/content/tariffs";
import { servicesByLocation } from "@/content/services";
import { connection } from "next/server";
import { getLocationPresentation } from "@/lib/public-content";
type Props = { params: Promise<{ city: string }> };
export const generateStaticParams = locationStaticParams;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  if (!isLocationSlug(city)) return {};
  const location = getLocation(city);
  return {
    title: `Ежеминутка — тайм-кафе с ёжиками в ${location.cityPrepositional}`,
    description: location.description,
  };
}
export default async function CityPage({ params }: Props) {
  const { city } = await params;
  if (!isLocationSlug(city)) return notFound();
  await connection();
  const presentation = await getLocationPresentation(city);
  return (
    <CityLanding
      location={getLocation(city)}
      tariffs={tariffsByLocation[city]}
      media={mediaByLocation[city]}
      services={servicesByLocation[city]}
      presentation={presentation}
    />
  );
}
