import Link from "next/link";
import { Media } from "./Media";
import { TariffCard } from "./TariffCard";
import type { Location } from "@/config/locations";
import type { LocationMedia } from "@/config/media";
import type { LocationTariffs } from "@/content/tariffs";
import type { Service } from "@/content/services";
const amenities = [
  ["Ёжики", "Бережное общение с главными хозяевами."],
  ["Настольные игры", "Для двоих, семьи или компании."],
  ["Игровые приставки", "Для дружеского турнира."],
  ["Wi-Fi", "Оставайтесь на связи."],
  ["Уютное пространство", "Для отдыха и разговоров."],
];
export function CityLanding({
  location,
  tariffs,
  media,
  services,
}: {
  location: Location;
  tariffs: LocationTariffs;
  media: LocationMedia;
  services: Service[];
}) {
  const base = `/${location.slug}`;
  const enabled = services.filter((x) => x.enabled);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Необычная пауза в большом городе</span>
            <h1>{location.heroTitle}</h1>
            <p className="lead">{location.description}</p>
            <div className="actions">
              <Link className="button" href={`${base}/booking`}>
                Забронировать посещение
              </Link>
              <Link className="button button-ghost" href="#tariffs">
                Узнать стоимость
              </Link>
            </div>
            <p className="location">
              <strong>{location.city}</strong>
              <span>{location.addressShort}</span>
            </p>
          </div>
          <Media
            src={media.hero}
            alt={`Интерьер Ежеминутки в ${location.cityPrepositional}`}
            className="hero-media"
            label={`Фотография кафе — ${location.name}`}
            priority
          />
        </div>
      </section>
      <section className="section" id="about">
        <div className="container split">
          <div>
            <span className="eyebrow">О кафе</span>
            <h2>Время здесь считают, а впечатления — нет</h2>
          </div>
          <div className="story">
            <p>
              «Ежеминутка» — тайм-кафе, где живут ёжики. Гости приходят провести с ними время и
              отдохнуть от городского ритма.
            </p>
            <p>Уют, игры и спокойная зона отдыха подходят взрослым и детям.</p>
          </div>
        </div>
      </section>
      <section className="section mint">
        <div className="container">
          <span className="eyebrow">Внутри</span>
          <h2>Что есть в «Ежеминутке»</h2>
          <div className="amenities">
            {amenities.map(([title, text], i) => (
              <article className="amenity" key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="tariffs">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Тарифы</span>
              <h2>Форматы в {location.cityPrepositional}</h2>
            </div>
            <p>У каждого кафе свои условия посещения.</p>
          </div>
          <div className="tariff-grid">
            {tariffs.cards.map((t) => (
              <TariffCard tariff={t} bookingHref={`${base}/booking`} key={t.id} />
            ))}
          </div>
          <div className="tariff-conditions">
            {tariffs.conditions.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="section dark" id="occasions">
        <div className="container">
          <span className="eyebrow">Доступные возможности</span>
          <h2>Поводы встретиться</h2>
          <div className="occasion-grid">
            {enabled.map((item, i) => (
              <article className="occasion" key={item.id}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container hedgehogs">
          <div>
            <span className="eyebrow">Знакомство поближе</span>
            <h2>Главные хозяева кафе</h2>
            <p className="lead">
              Администратор подскажет, как общаться с ёжиками спокойно и бережно.
            </p>
          </div>
          <div className="hedgehog-media">
            <Media src={media.hedgehog1} alt="Ёжик в Ежеминутке" label="Фотография ёжика" />
            <Media src={media.hedgehog2} alt="Знакомство с ёжиком" label="Знакомство с ёжиком" />
          </div>
        </div>
      </section>
      <section className="section" id="gallery">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Атмосфера</span>
              <h2>Галерея</h2>
            </div>
            <Link className="text-link" href={`${base}/gallery`}>
              Смотреть всё →
            </Link>
          </div>
          <div className="gallery-preview">
            <Media src={media.interior1} alt="Интерьер кафе" label="Интерьер кафе" />
            <Media src={media.hedgehog1} alt="Общение с ёжиками" label="Общение с ёжиками" />
            <Media src={media.event1} alt="Событие в кафе" label="Событие в кафе" />
          </div>
        </div>
      </section>
      <section className="section mint">
        <div className="container">
          <span className="eyebrow">Новости кафе</span>
          <div className="empty-state">
            <span className="media-mark" aria-hidden="true" />
            <div>
              <h2>Новости уже в пути</h2>
              <p>У этого кафе будет собственная лента новостей.</p>
              <Link className="text-link" href={`${base}/news`}>
                Открыть раздел →
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section contacts" id="contacts">
        <div className="container split">
          <div>
            <span className="eyebrow">Контакты</span>
            <h2>{location.city}</h2>
            <p className="lead">{location.address}</p>
          </div>
          <div className="contact-actions">
            {location.floor && <p>Этаж: {location.floor}</p>}
            {location.metro && <p>Метро: {location.metro}</p>}
            <p>Ежедневно: {location.openingHours}</p>
            <a href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}>{location.phone}</a>
            <br />
            <a href={`mailto:${location.email}`}>{location.email}</a>
            {location.mapUrl && (
              <p>
                <a href={location.mapUrl}>Открыть карту</a>
              </p>
            )}
            {location.vkUrl && (
              <p>
                <a href={location.vkUrl}>VK кафе</a>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
