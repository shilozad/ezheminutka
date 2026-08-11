import Link from "next/link";
import { Media } from "./Media";
import { TariffCard } from "./TariffCard";
import type { Location } from "@/config/locations";
import type { LocationMedia } from "@/config/media";
import type { LocationTariffs } from "@/content/tariffs";
import type { Service } from "@/content/services";
import type { LocationPresentation } from "@/lib/public-content";
import { AmenityIcon } from "./AmenityIcon";
const rules = [
  "Слушать администратора",
  "Бережно обращаться с животными",
  "Детям общаться с ёжиками под присмотром взрослых",
  "Мыть или обрабатывать руки",
  "Не кормить ёжиков своей едой",
];
export function CityLanding({
  location,
  tariffs,
  media,
  services,
  presentation,
}: {
  location: Location;
  tariffs: LocationTariffs;
  media: LocationMedia;
  services: Service[];
  presentation: LocationPresentation;
}) {
  const base = `/${location.slug}`;
  const enabled = services.filter((x) => x.enabled);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{presentation.heroEyebrow}</span>
            <h1>{presentation.heroTitle}</h1>
            <p className="lead">{presentation.heroDescription}</p>
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
            src={presentation.heroImage}
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
          <span className="eyebrow">{presentation.amenitiesEyebrow}</span>
          <h2>{presentation.amenitiesTitle}</h2>
          <div className="amenities">
            {presentation.amenities.map((amenity, i) => (
              <article
                className={`amenity ${amenity.backgroundUrl ? "amenity-photo" : ""}`}
                key={amenity.id}
                style={
                  amenity.backgroundUrl
                    ? {
                        backgroundImage: `linear-gradient(rgba(20,30,26,.55),rgba(20,30,26,.7)),url("${amenity.backgroundUrl}")`,
                      }
                    : undefined
                }
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <AmenityIcon icon={amenity.iconKey} />
                <h3>{amenity.title}</h3>
                <p>{amenity.description}</p>
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
      <section className="section rules">
        <div className="container split">
          <div>
            <span className="eyebrow">Забота прежде всего</span>
            <h2>Несложные правила общения</h2>
          </div>
          <ol>
            {rules.map((rule, index) => (
              <li key={rule}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {rule}
              </li>
            ))}
          </ol>
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
      <section className="section">
        <div className="container cta">
          <div>
            <span className="eyebrow">Пора знакомиться</span>
            <h2>Хотите познакомиться с ёжиками?</h2>
            <p>Выберите удобный формат — онлайн-бронирование скоро появится.</p>
          </div>
          <Link className="button button-light" href={`${base}/booking`}>
            Забронировать посещение
          </Link>
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
