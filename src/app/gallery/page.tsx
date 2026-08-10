import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { Media } from "@/components/Media";
import { mediaConfig } from "@/config/media";
export const metadata: Metadata = { title: "Галерея" };
const galleryItems: Array<{ label: string; src: string | null }> = [
  { label: "Интерьер — общий план", src: mediaConfig.interior1 },
  { label: "Зона отдыха", src: mediaConfig.interior2 },
  { label: "Знакомство с ёжиками", src: mediaConfig.hedgehog1 },
  { label: "Уютные детали", src: null },
  { label: "Праздник в кафе", src: mediaConfig.event1 },
  { label: "Время с друзьями", src: mediaConfig.event2 },
  { label: "Африканский ёжик", src: mediaConfig.hedgehog2 },
  { label: "Событие в Ежеминутке", src: null },
];
export default function GalleryPage() {
  return (
    <>
      <PageIntro eyebrow="Будущая фотолента" title="Галерея Ежеминутки">
        Здесь появятся настоящие фотографии пространства, ёжиков и встреч. Динамическую галерею
        подключим на следующем этапе.
      </PageIntro>
      <section className="section compact">
        <div className="container gallery-grid">
          {galleryItems.map(({ label, src }, i) => (
            <Media
              key={label}
              src={src}
              alt={label}
              label={label}
              sizes="(max-width: 480px) 100vw, (max-width: 760px) 50vw, 33vw"
              className={i === 0 || i === 5 ? "wide" : ""}
            />
          ))}
        </div>
      </section>
    </>
  );
}
