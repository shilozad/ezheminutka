import { PageIntro } from "./PageIntro";
import { Media } from "./Media";
import type { Location } from "@/config/locations";
import type { LocationMedia } from "@/config/media";
export function CityGallery({ location, media }: { location: Location; media: LocationMedia }) {
  const items = [
    ["Интерьер — общий план", media.interior1],
    ["Зона отдыха", media.interior2],
    ["Знакомство с ёжиками", media.hedgehog1],
    ["Африканский ёжик", media.hedgehog2],
    ["Праздник в кафе", media.event1],
    ["Событие в Ежеминутке", media.event2],
  ] as const;
  return (
    <>
      <PageIntro eyebrow="Фотографии кафе" title={`Галерея — ${location.name}`}>
        Здесь появятся фотографии пространства, ёжиков и событий именно этого кафе.
      </PageIntro>
      <section className="section compact">
        <div className="container gallery-grid">
          {items.map(([label, src], i) => (
            <Media
              key={label}
              src={src}
              alt={label}
              label={label}
              className={i === 0 ? "wide" : ""}
            />
          ))}
        </div>
      </section>
    </>
  );
}
