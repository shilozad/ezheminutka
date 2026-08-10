import Link from "next/link";
import { Media } from "@/components/Media";
import { tariffs } from "@/content/tariffs";
import { siteConfig } from "@/config/site";
import { mediaConfig } from "@/config/media";
const amenities = [
  ["01", "Ёжики", "Знакомство и бережное общение с главными хозяевами."],
  ["02", "Чай и печенье", "Тёплое дополнение к неспешной встрече."],
  ["03", "Настольные игры", "Для двоих, семьи или небольшой компании."],
  ["04", "Игровая приставка", "Можно устроить дружеский турнир."],
  ["05", "Wi-Fi", "Оставайтесь на связи, если это действительно нужно."],
  ["06", "Уютное пространство", "Мягкая зона для отдыха и разговоров."],
];
const occasions = [
  "Обычное посещение",
  "Свидание",
  "День рождения",
  "Детский праздник",
  "Фотосессия",
  "Экскурсия",
  "Аренда кафе",
];
const rules = [
  "Слушать администратора",
  "Бережно обращаться с животными",
  "Детям общаться с ёжиками под присмотром взрослых",
  "Мыть или обрабатывать руки",
  "Не кормить ёжиков своей едой",
];
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Необычная пауза в большом городе</span>
            <h1>
              Тайм-кафе с ёжиками <em>в центре Петербурга</em>
            </h1>
            <p className="lead">
              Место, где знакомятся с африканскими ёжиками, проводят время с близкими и просто
              немного замедляются.
            </p>
            <div className="actions">
              <Link className="button" href="/booking">
                Забронировать посещение
              </Link>
              <Link className="button button-ghost" href="#tariffs">
                Узнать стоимость
              </Link>
            </div>
            <p className="location">
              <strong>Санкт-Петербург</strong>
              <span>Владимирский проспект, 1/47</span>
            </p>
          </div>
          <Media
            src={mediaConfig.hero}
            alt="Интерьер тайм-кафе Ежеминутка"
            className="hero-media"
            label="Место для будущей фотографии hero.jpg"
            priority
            sizes="(max-width: 760px) 100vw, 48vw"
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
              «Ежеминутка» — тайм-кафе, где живут африканские ёжики. Гости приходят провести с ними
              время и отдохнуть от городского ритма.
            </p>
            <p>
              Здесь есть чай и печенье, настольные игры, приставка и спокойная зона отдыха. Формат
              подходит взрослым и детям — для семейного дня, свидания или встречи друзей.
            </p>
          </div>
        </div>
      </section>
      <section className="section mint">
        <div className="container">
          <span className="eyebrow">Внутри</span>
          <h2>Что есть в «Ежеминутке»</h2>
          <div className="amenities">
            {amenities.map(([n, t, d]) => (
              <article className="amenity" key={t}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
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
              <h2>Выберите свой формат</h2>
            </div>
            <p>
              Реальные цены появятся после согласования. Пока можно выбрать подходящий сценарий.
            </p>
          </div>
          <div className="tariff-grid">
            {tariffs.map((t) => (
              <article className={`tariff ${t.accent ? "accent" : ""}`} key={t.id}>
                <h3>{t.title}</h3>
                <p>{t.description}</p>
                <strong>
                  {t.price === null ? "Стоимость уточняется" : `${t.price} ${t.priceSuffix ?? ""}`}
                </strong>
                <ul>
                  {t.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link href="/booking">
                  Выбрать формат <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section dark" id="occasions">
        <div className="container">
          <span className="eyebrow">Поводы встретиться</span>
          <h2>Каждый визит — особенный</h2>
          <div className="occasion-grid">
            {occasions.map((item, i) => (
              <article className={`occasion occasion-${i % 3}`} key={item}>
                <span>0{i + 1}</span>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container hedgehogs">
          <div className="hedgehog-copy">
            <span className="eyebrow">Знакомство поближе</span>
            <h2>Главные хозяева «Ежеминутки»</h2>
            <p className="lead">
              Администратор познакомит вас с ёжиками и подскажет, как общаться с ними спокойно и
              бережно. Не торопитесь — дайте им время привыкнуть.
            </p>
          </div>
          <div className="hedgehog-media">
            <Media
              src={mediaConfig.hedgehog1}
              alt="Африканский ёжик в Ежеминутке"
              label="Будущая фотография hedgehog-01.jpg"
              sizes="(max-width: 480px) 100vw, 30vw"
            />
            <Media
              src={mediaConfig.hedgehog2}
              alt="Знакомство с африканским ёжиком"
              label="Будущая фотография hedgehog-02.jpg"
              sizes="(max-width: 480px) 100vw, 30vw"
            />
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
            {rules.map((r, i) => (
              <li key={r}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {r}
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
            <Link className="text-link" href="/gallery">
              Смотреть всё →
            </Link>
          </div>
          <div className="gallery-preview">
            <Media
              src={mediaConfig.interior1}
              alt="Интерьер кафе"
              label="Интерьер кафе"
              sizes="(max-width: 480px) 82vw, 42vw"
            />
            <Media
              src={mediaConfig.hedgehog1}
              alt="Общение с ёжиками"
              label="Общение с ёжиками"
              sizes="(max-width: 480px) 82vw, 24vw"
            />
            <Media
              src={mediaConfig.event1}
              alt="Событие в Ежеминутке"
              label="Событие в Ежеминутке"
              sizes="(max-width: 480px) 82vw, 24vw"
            />
          </div>
        </div>
      </section>
      <section className="section mint" id="news">
        <div className="container">
          <span className="eyebrow">Скоро здесь</span>
          <h2>Новости Ежеминутки</h2>
          <div className="empty-state">
            <span className="media-mark" aria-hidden="true" />
            <div>
              <h3>Будем делиться новостями</h3>
              <p>Здесь будут появляться свежие новости из нашей группы VK.</p>
              <Link className="text-link" href="/news">
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
          <Link className="button button-light" href="/booking">
            Забронировать посещение
          </Link>
        </div>
      </section>
      <section className="section contacts" id="contacts">
        <div className="container split">
          <div>
            <span className="eyebrow">Контакты</span>
            <h2>{siteConfig.name}</h2>
            <p className="lead">
              Санкт-Петербург
              <br />
              Владимирский проспект, 1/47
            </p>
          </div>
          <div className="contact-actions">
            {siteConfig.phone && <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>}
            {siteConfig.openingHours && <p>{siteConfig.openingHours}</p>}
            {siteConfig.vkUrl && <a href={siteConfig.vkUrl}>VK</a>}
            {siteConfig.mapUrl && <a href={siteConfig.mapUrl}>Открыть карту</a>}
            <p>Телефон, режим работы и карта появятся после уточнения.</p>
          </div>
        </div>
      </section>
    </>
  );
}
