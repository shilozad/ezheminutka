import { notFound } from "next/navigation";
import { BookingPreview } from "@/components/BookingPreview";
import { getLocation, isLocationSlug, locationStaticParams } from "@/config/locations";
import { servicesByLocation } from "@/content/services";
type Props = { params: Promise<{ city: string }> };
export const generateStaticParams = locationStaticParams;
export default async function Page({ params }: Props) {
  const { city } = await params;
  if (!isLocationSlug(city)) return notFound();
  return <BookingPreview location={getLocation(city)} services={servicesByLocation[city]} />;
}
