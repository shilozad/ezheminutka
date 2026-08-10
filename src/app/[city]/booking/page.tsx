import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { PageIntro } from "@/components/PageIntro";
import { getLocation, isLocationSlug, locationStaticParams } from "@/config/locations";
import { servicesByLocation } from "@/content/services";
type Props = { params: Promise<{ city: string }> };
export const generateStaticParams = locationStaticParams;
export default async function Page({ params }: Props) {
  const { city } = await params;
  if (!isLocationSlug(city)) return notFound();
  const location = getLocation(city);
  const enabled = process.env.BOOKING_ENABLED === "true" && Boolean(process.env.DATABASE_URL);
  return (
    <>
      <PageIntro eyebrow="Ваш визит" title={`Бронирование — ${location.name}`}>
        Город определён адресом страницы. Оставьте заявку, и администратор свяжется с вами.
      </PageIntro>
      <section className="section compact">
        <div className="container booking-layout">
          <BookingForm location={location} services={servicesByLocation[city]} enabled={enabled} />
          <aside className="booking-note">
            <span className="eyebrow">Важно</span>
            <h2>{enabled ? "Подтверждение заявки" : "Онлайн-бронирование скоро будет доступно"}</h2>
            <p>
              {enabled
                ? "Бронирование подтвердит администратор после связи с вами. "
                : "Пока запишитесь по телефону: "}
              <a href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}>{location.phone}</a>.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
