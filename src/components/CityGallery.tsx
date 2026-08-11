"use client";
import { useEffect, useState } from "react";
import { PageIntro } from "./PageIntro";
import type { Location } from "@/config/locations";
import type { PublicGalleryItem } from "@/lib/public-gallery";

export function CityGallery({
  location,
  items,
}: {
  location: Location;
  items: PublicGalleryItem[];
}) {
  const photos = items.filter((x) => x.imageUrl);
  const [open, setOpen] = useState<string | null>(null);
  const selected = photos.findIndex((x) => x.id === open);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);
  const move = (delta: number) =>
    setOpen(photos[(selected + delta + photos.length) % photos.length]?.id ?? null);
  return (
    <>
      <PageIntro eyebrow="Фотографии кафе" title={`Галерея — ${location.name}`}>
        Пространство, ёжики и события именно этого кафе.
      </PageIntro>
      <section className="section compact">
        <div className="container public-gallery">
          {!items.length && <div className="gallery-empty">Фотографии скоро появятся.</div>}
          {items.map((item, i) => (
            <article className={`gallery-card ${item.featured ? "featured" : ""}`} key={item.id}>
              {item.imageUrl ? (
                <button
                  className="gallery-image-button"
                  onClick={() => setOpen(item.id)}
                  aria-label={`Открыть фотографию: ${item.title}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.altText}
                    loading={i === 0 && item.featured ? "eager" : "lazy"}
                  />
                </button>
              ) : (
                <div
                  className="gallery-placeholder"
                  role="img"
                  aria-label={`Фотография «${item.altText}» скоро появится`}
                >
                  <span>Фото скоро появится</span>
                </div>
              )}
              <div className="gallery-copy">
                <h2>{item.title}</h2>
                {item.caption && <p>{item.caption}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>
      {selected >= 0 && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Просмотр: ${photos[selected].title}`}
        >
          <button className="lightbox-close" aria-label="Закрыть" onClick={() => setOpen(null)}>
            ×
          </button>
          {photos.length > 1 && (
            <button
              className="lightbox-prev"
              aria-label="Предыдущая фотография"
              onClick={() => move(-1)}
            >
              ‹
            </button>
          )}
          <figure>
            <img src={photos[selected].imageUrl!} alt={photos[selected].altText} />
            <figcaption>
              <strong>{photos[selected].title}</strong>
              {photos[selected].caption && <span>{photos[selected].caption}</span>}
            </figcaption>
          </figure>
          {photos.length > 1 && (
            <button
              className="lightbox-next"
              aria-label="Следующая фотография"
              onClick={() => move(1)}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
