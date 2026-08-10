import { notFound } from "next/navigation";
import { CityNews } from "@/components/CityNews";
import { getLocation, isLocationSlug, locationStaticParams } from "@/config/locations";
type Props = { params: Promise<{ city: string }> };
export const generateStaticParams = locationStaticParams;
export default async function Page({ params }: Props) {
  const { city } = await params;
  if (!isLocationSlug(city)) return notFound();
  return <CityNews location={getLocation(city)} />;
}
