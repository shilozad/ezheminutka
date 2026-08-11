"use client";
import { useEffect, useRef, useState } from "react";
import { AmenityIcon, amenityIconKeys, type AmenityIconKey } from "@/components/AmenityIcon";
type City = "moscow" | "spb" | "kazan";
type Role = "SUPERADMIN" | City;
type Tab = "bookings" | "appearance" | "gallery";
type Booking = {
  id: number;
  city: City;
  name: string;
  phone: string;
  date: string;
  status: "new" | "confirmed" | "cancelled";
};
type Gallery = {
  id: string;
  title: string;
  alt: string;
  caption: string;
  featured: boolean;
  active: boolean;
  url: string | null;
};
const names: Record<City, string> = { moscow: "Москва", spb: "Санкт-Петербург", kazan: "Казань" };
const initialBookings: Booking[] = [
  {
    id: 1,
    city: "moscow",
    name: "Иван Тестовый",
    phone: "+7 900 000-00-01",
    date: "15 августа, 14:00",
    status: "new",
  },
  {
    id: 2,
    city: "spb",
    name: "Мария Демонстрационная",
    phone: "+7 900 000-00-02",
    date: "16 августа, 16:30",
    status: "confirmed",
  },
  {
    id: 3,
    city: "kazan",
    name: "Алексей Тестовый",
    phone: "+7 900 000-00-03",
    date: "17 августа, 12:00",
    status: "cancelled",
  },
];
const slots = [
  "Интерьер — общий план",
  "Зона отдыха",
  "Знакомство с ёжиками",
  "Африканский ёжик",
  "Праздник в кафе",
  "Событие в Ежеминутке",
];
const gallery = (): Record<City, Gallery[]> =>
  Object.fromEntries(
    (Object.keys(names) as City[]).map((city) => [
      city,
      slots.map((title, i) => ({
        id: `${city}-${i}`,
        title,
        alt: title,
        caption: "",
        featured: i === 0,
        active: true,
        url: null,
      })),
    ]),
  ) as Record<City, Gallery[]>;
const appearance = () =>
  Object.fromEntries(
    (Object.keys(names) as City[]).map((city) => [
      city,
      {
        eyebrow: "Необычная пауза в большом городе",
        title: `Тайм-кафе с ёжиками — ${names[city]}`,
        description: "Живые ёжики, уют, игры и необычный отдых.",
        hero: null as string | null,
        amenities: [
          {
            id: "hedgehogs",
            title: "Ёжики",
            description: "Знакомство с африканскими ёжиками",
            icon: "hedgehog" as AmenityIconKey,
            active: true,
            url: null as string | null,
          },
          {
            id: "games",
            title: "Игры",
            description: "Настольные игры для компании",
            icon: "board-games" as AmenityIconKey,
            active: true,
            url: null as string | null,
          },
        ],
      },
    ]),
  ) as any;
export default function DemoAdmin() {
  const [role, setRole] = useState<Role>("SUPERADMIN"),
    [tab, setTab] = useState<Tab>("bookings"),
    [city, setCity] = useState<City>("moscow"),
    [bookings, setBookings] = useState(initialBookings),
    [galleries, setGalleries] = useState(gallery),
    [looks, setLooks] = useState(appearance),
    [selected, setSelected] = useState<Booking | null>(null),
    [filter, setFilter] = useState("all"),
    [logo, setLogo] = useState<string | null>(null);
  const urls = useRef<string[]>([]);
  const allowed: City[] = role === "SUPERADMIN" ? ["moscow", "spb", "kazan"] : [role];
  useEffect(() => {
    if (!allowed.includes(city)) setCity(allowed[0]);
  }, [role]);
  useEffect(() => () => urls.current.forEach(URL.revokeObjectURL), []);
  const local = (file: File) => {
    const url = URL.createObjectURL(file);
    urls.current.push(url);
    return url;
  };
  const reset = () => {
    urls.current.forEach(URL.revokeObjectURL);
    urls.current = [];
    setBookings(initialBookings);
    setGalleries(gallery());
    setLooks(appearance());
    setLogo(null);
    setSelected(null);
    setFilter("all");
  };
  const currentG = galleries[city],
    look = looks[city];
  const setG = (v: Gallery[]) => setGalleries((x) => ({ ...x, [city]: v }));
  const patchLook = (v: any) => setLooks((x: any) => ({ ...x, [city]: { ...x[city], ...v } }));
  return (
    <div className="admin-page demo-admin">
      <div className="demo-banner">
        <strong>ДЕМО-РЕЖИМ</strong>
        <span>Данные не сохраняются и сбросятся после обновления страницы.</span>
      </div>
      <header className="admin-header">
        <div>
          <b>Ежеминутка</b>
          <span>Интерактивная демонстрация</span>
          <nav>
            {(["bookings", "appearance", "gallery"] as Tab[]).map((x, i) => (
              <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>
                {["Брони", "Внешний вид", "Галерея"][i]}
              </button>
            ))}
          </nav>
        </div>
        <div>
          <select
            aria-label="Роль в демо"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="SUPERADMIN">Суперадмин</option>
            <option value="moscow">Админ Москвы</option>
            <option value="spb">Админ Санкт-Петербурга</option>
            <option value="kazan">Админ Казани</option>
          </select>
          <button onClick={reset}>Сбросить демо</button>
        </div>
      </header>
      <main className="admin-content">
        <div className="demo-explainer">
          Все изменения существуют только в памяти этой вкладки. Реальная публичная страница от демо
          не изменится.
        </div>
        <div className="admin-city-tabs">
          {allowed.map((x) => (
            <button key={x} className={city === x ? "active" : ""} onClick={() => setCity(x)}>
              {names[x]}
            </button>
          ))}
        </div>
        {tab === "bookings" && (
          <section>
            <div className="admin-title">
              <h1>Брони</h1>
              <button
                className="admin-primary"
                onClick={() =>
                  setBookings((x) => [
                    ...x,
                    {
                      id: Date.now(),
                      city,
                      name: "Новая тестовая бронь",
                      phone: "+7 900 000-00-04",
                      date: "18 августа, 15:00",
                      status: "new",
                    },
                  ])
                }
              >
                Добавить тестовую бронь
              </button>
            </div>
            <div className="admin-filters">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">Все статусы</option>
                <option value="new">Новые</option>
                <option value="confirmed">Подтверждённые</option>
                <option value="cancelled">Отменённые</option>
              </select>
            </div>
            <div className="admin-booking-list">
              {bookings
                .filter((x) => x.city === city && (filter === "all" || x.status === filter))
                .map((x) => (
                  <article className="admin-booking-card" key={x.id}>
                    <div>
                      <span className={`admin-status ${x.status}`}>{x.status}</span>
                      <h3>{x.name}</h3>
                      <p>
                        {x.phone} · {x.date}
                      </p>
                    </div>
                    <div>
                      <select
                        value={x.status}
                        onChange={(e) =>
                          setBookings((all) =>
                            all.map((b) =>
                              b.id === x.id
                                ? { ...b, status: e.target.value as Booking["status"] }
                                : b,
                            ),
                          )
                        }
                      >
                        <option value="new">Новая</option>
                        <option value="confirmed">Подтверждена</option>
                        <option value="cancelled">Отменена</option>
                      </select>
                      <button onClick={() => setSelected(x)}>Открыть</button>
                      <button
                        className="admin-danger"
                        onClick={() => setBookings((all) => all.filter((b) => b.id !== x.id))}
                      >
                        Удалить
                      </button>
                    </div>
                  </article>
                ))}
            </div>
            {selected && (
              <div className="admin-modal" role="dialog" aria-modal="true">
                <div>
                  <button
                    className="admin-close"
                    aria-label="Закрыть"
                    onClick={() => setSelected(null)}
                  >
                    ×
                  </button>
                  <h2>{selected.name}</h2>
                  <p>{selected.phone}</p>
                  <p>
                    {selected.date}, {names[selected.city]}
                  </p>
                </div>
              </div>
            )}
          </section>
        )}
        {tab === "appearance" && (
          <section className="appearance">
            <div className="admin-title">
              <h1>Внешний вид</h1>
              <a href={`/${city}`} target="_blank">
                Открыть страницу кафе ↗
              </a>
            </div>
            {role === "SUPERADMIN" && (
              <section className="appearance-section">
                <h2>Бренд и логотип</h2>
                {logo && <img className="logo-preview" src={logo} alt="Локальный логотип" />}
                <Local label="Выбрать локальный логотип" onFile={(f) => setLogo(local(f))} />
              </section>
            )}
            <section className="appearance-section">
              <h2>Первый экран</h2>
              <Field
                label="Надпись"
                value={look.eyebrow}
                onChange={(v) => patchLook({ eyebrow: v })}
              />
              <Field
                label="Заголовок"
                value={look.title}
                onChange={(v) => patchLook({ title: v })}
              />
              <Field
                label="Описание"
                value={look.description}
                onChange={(v) => patchLook({ description: v })}
              />
              {look.hero && (
                <img className="hero-preview" src={look.hero} alt="Предпросмотр первого экрана" />
              )}
              <Local label="Выбрать локальное фото" onFile={(f) => patchLook({ hero: local(f) })} />
            </section>
            <section className="appearance-section">
              <h2>Карточки преимуществ</h2>
              <div className="card-editors">
                {look.amenities.map((a: any, i: number) => (
                  <article
                    className={`card-editor ${a.url ? "demo-photo-card" : ""}`}
                    style={
                      a.url
                        ? {
                            backgroundImage: `linear-gradient(0deg,rgba(18,63,59,.75),rgba(18,63,59,.1)),url(${a.url})`,
                          }
                        : {}
                    }
                    key={a.id}
                  >
                    <AmenityIcon icon={a.icon} />
                    <Field
                      label="Название"
                      value={a.title}
                      onChange={(v) =>
                        patchLook({
                          amenities: look.amenities.map((q: any, n: number) =>
                            n === i ? { ...q, title: v } : q,
                          ),
                        })
                      }
                    />
                    <Field
                      label="Описание"
                      value={a.description}
                      onChange={(v) =>
                        patchLook({
                          amenities: look.amenities.map((q: any, n: number) =>
                            n === i ? { ...q, description: v } : q,
                          ),
                        })
                      }
                    />
                    <label>
                      Иконка
                      <select
                        value={a.icon}
                        onChange={(e) =>
                          patchLook({
                            amenities: look.amenities.map((q: any, n: number) =>
                              n === i ? { ...q, icon: e.target.value } : q,
                            ),
                          })
                        }
                      >
                        {amenityIconKeys.map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={a.active}
                        onChange={(e) =>
                          patchLook({
                            amenities: look.amenities.map((q: any, n: number) =>
                              n === i ? { ...q, active: e.target.checked } : q,
                            ),
                          })
                        }
                      />{" "}
                      Активна
                    </label>
                    <Local
                      label="Локальное фото карточки"
                      onFile={(f) =>
                        patchLook({
                          amenities: look.amenities.map((q: any, n: number) =>
                            n === i ? { ...q, url: local(f) } : q,
                          ),
                        })
                      }
                    />
                    <button
                      onClick={() => {
                        const a = [...look.amenities];
                        if (i > 0) [a[i - 1], a[i]] = [a[i], a[i - 1]];
                        patchLook({ amenities: a });
                      }}
                    >
                      Выше
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}
        {tab === "gallery" && (
          <section>
            <div className="admin-title">
              <h1>Галерея</h1>
              <Local
                label="Добавить локальное фото"
                onFile={(f) =>
                  setG([
                    ...currentG,
                    {
                      id: crypto.randomUUID(),
                      title: "Новая фотография",
                      alt: "Фотография кафе",
                      caption: "",
                      featured: false,
                      active: true,
                      url: local(f),
                    },
                  ])
                }
              />
            </div>
            <div className="gallery-editors">
              {currentG.map((g, i) => (
                <article className="gallery-editor" key={g.id}>
                  <div className="admin-gallery-preview">
                    {g.url ? <img src={g.url} alt={g.alt} /> : <span>Фото скоро появится</span>}
                  </div>
                  <div className="gallery-fields">
                    <Field
                      label="Название"
                      value={g.title}
                      onChange={(v) =>
                        setG(currentG.map((x) => (x.id === g.id ? { ...x, title: v } : x)))
                      }
                    />
                    <Field
                      label="Alt"
                      value={g.alt}
                      onChange={(v) =>
                        setG(currentG.map((x) => (x.id === g.id ? { ...x, alt: v } : x)))
                      }
                    />
                    <Field
                      label="Подпись"
                      value={g.caption}
                      onChange={(v) =>
                        setG(currentG.map((x) => (x.id === g.id ? { ...x, caption: v } : x)))
                      }
                    />
                    <label>
                      <input
                        type="checkbox"
                        checked={g.featured}
                        onChange={(e) =>
                          setG(
                            currentG.map((x) =>
                              x.id === g.id ? { ...x, featured: e.target.checked } : x,
                            ),
                          )
                        }
                      />{" "}
                      Показывать крупнее
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={g.active}
                        onChange={(e) =>
                          setG(
                            currentG.map((x) =>
                              x.id === g.id ? { ...x, active: e.target.checked } : x,
                            ),
                          )
                        }
                      />{" "}
                      Активна
                    </label>
                    <div className="gallery-actions">
                      <button
                        onClick={() => {
                          const a = [...currentG];
                          if (i > 0) [a[i - 1], a[i]] = [a[i], a[i - 1]];
                          setG(a);
                        }}
                      >
                        Вверх
                      </button>
                      <button onClick={() => setG(currentG.filter((x) => x.id !== g.id))}>
                        Удалить
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <h2>Предпросмотр публичной галереи</h2>
            <div className="public-gallery demo-gallery-preview">
              {currentG
                .filter((x) => x.active)
                .map((g) => (
                  <article className={`gallery-card ${g.featured ? "featured" : ""}`} key={g.id}>
                    {g.url ? (
                      <img src={g.url} alt={g.alt} />
                    ) : (
                      <div className="gallery-placeholder" role="img" aria-label={g.alt}>
                        Фото скоро появится
                      </div>
                    )}
                    <div className="gallery-copy">
                      <h2>{g.title}</h2>
                      {g.caption && <p>{g.caption}</p>}
                    </div>
                  </article>
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label>
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
function Local({ label, onFile }: { label: string; onFile: (f: File) => void }) {
  return (
    <label className="button admin-upload">
      {label}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}
