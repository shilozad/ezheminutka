"use client";
import { useState } from "react";
import type { AdminContext } from "@/lib/admin-auth";
import type { LocationPresentation } from "@/lib/public-content";
import type { AmenityPresentation } from "@/content/amenities";
import { amenityIconKeys, AmenityIcon } from "@/components/AmenityIcon";
import { AdminHeader } from "./AdminHeader";
const names = { moscow: "Москва", spb: "Санкт-Петербург", kazan: "Казань" };
type Asset = { id: string; url: string };
export default function Editor({
  admin,
  initial,
  initialLogo,
  uploadEnabled,
}: {
  admin: AdminContext;
  initial: Record<string, LocationPresentation>;
  initialLogo: Asset | null;
  uploadEnabled: boolean;
}) {
  const [city, setCity] = useState(admin.allowedLocations[0]),
    [data, setData] = useState(initial),
    [logo, setLogo] = useState(initialLogo),
    [busy, setBusy] = useState(""),
    [message, setMessage] = useState(""),
    [dirty, setDirty] = useState(false);
  const current = data[city];
  function patch(value: Partial<LocationPresentation>) {
    setData({ ...data, [city]: { ...current, ...value } });
    setDirty(true);
  }
  function cards(value: AmenityPresentation[]) {
    patch({ amenities: value });
  }
  async function upload(file: File, locationId: string | null) {
    setBusy("upload");
    setMessage("Загружаем…");
    try {
      const f = new FormData();
      f.set("file", file);
      if (locationId) f.set("locationId", locationId);
      const r = await fetch("/api/admin/media", { method: "POST", body: f }),
        j = await r.json();
      if (!r.ok) throw new Error(j.error.message);
      return j.asset as Asset;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Ошибка загрузки.");
      return null;
    } finally {
      setBusy("");
    }
  }
  async function save() {
    if (busy) return;
    setBusy("save");
    setMessage("Сохраняем…");
    const r = await fetch(`/api/admin/appearance/${city}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...current,
        heroAssetId: current.heroAssetId,
        amenities: current.amenities.map((x) => ({ ...x, backgroundAssetId: x.backgroundAssetId })),
      }),
    });
    const j = await r.json();
    setBusy("");
    if (r.ok) {
      setDirty(false);
      setMessage("Изменения сохранены");
    } else setMessage(j.error.message);
  }
  async function logoUpload(file: File) {
    const a = await upload(file, null);
    if (!a) return;
    const r = await fetch("/api/admin/appearance/brand", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ logoAssetId: a.id }),
    });
    if (r.ok) {
      setLogo(a);
      setMessage("Логотип сохранён");
    }
  }
  async function resetLogo() {
    await fetch("/api/admin/appearance/brand", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: '{"logoAssetId":null}',
    });
    setLogo(null);
  }
  return (
    <div className="admin-page">
      <AdminHeader admin={admin} subtitle="Внешний вид сайта" />
      <main className="admin-content appearance">
        <div className="admin-title">
          <div>
            <h1>Внешний вид сайта</h1>
            {dirty && <small>Есть несохранённые изменения</small>}
          </div>
          <a href={`/${city}`} target="_blank">
            Открыть страницу кафе ↗
          </a>
        </div>
        {admin.role === "SUPERADMIN" && (
          <section className="appearance-section">
            <h2>Бренд</h2>
            {logo && <img className="logo-preview" src={logo.url} alt="Текущий логотип" />}
            <FileButton
              disabled={!uploadEnabled || !!busy}
              label={busy === "upload" ? "Загружаем…" : "Загрузить логотип"}
              onFile={logoUpload}
            />
            <button onClick={resetLogo}>Вернуть стандартный</button>
            <p>Рекомендуется PNG/WebP с прозрачным фоном.</p>
          </section>
        )}
        <div className="admin-city-tabs">
          {admin.allowedLocations.map((x) => (
            <button className={city === x ? "active" : ""} onClick={() => setCity(x)} key={x}>
              {names[x]}
            </button>
          ))}
        </div>
        <section className="appearance-section">
          <h2>Первый экран</h2>
          <Field
            label="Надпись над заголовком"
            value={current.heroEyebrow}
            max={160}
            onChange={(v) => patch({ heroEyebrow: v })}
          />
          <Field
            label="Заголовок"
            value={current.heroTitle}
            max={240}
            onChange={(v) => patch({ heroTitle: v })}
          />
          <Field
            area
            label="Описание"
            value={current.heroDescription}
            max={600}
            onChange={(v) => patch({ heroDescription: v })}
          />
          {current.heroImage && (
            <img
              className="hero-preview"
              src={current.heroImage}
              alt={`Первый экран — ${names[city]}`}
            />
          )}
          <p>Рекомендуется горизонтальное фото примерно 1600×1000 или больше.</p>
          <FileButton
            disabled={!uploadEnabled || !!busy}
            label="Загрузить фото"
            onFile={async (f) => {
              const a: any = await upload(f, city);
              if (a) {
                patch({ heroImage: a.url } as any);
                (data[city] as any).heroAssetId = a.id;
              }
            }}
          />
          <button
            onClick={() => {
              patch({ heroImage: null });
              (data[city] as any).heroAssetId = null;
            }}
          >
            Убрать фото
          </button>
        </section>
        <section className="appearance-section">
          <h2>Блок «Что есть в Ежеминутке»</h2>
          <Field
            label="Надпись над заголовком"
            value={current.amenitiesEyebrow}
            max={160}
            onChange={(v) => patch({ amenitiesEyebrow: v })}
          />
          <Field
            label="Заголовок"
            value={current.amenitiesTitle}
            max={240}
            onChange={(v) => patch({ amenitiesTitle: v })}
          />
          <div className="card-editors">
            {current.amenities.map((a, i) => (
              <article className="card-editor" key={a.id}>
                <div
                  className={`amenity admin-preview ${a.backgroundUrl ? "amenity-photo" : ""}`}
                  style={
                    a.backgroundUrl
                      ? {
                          backgroundImage: `linear-gradient(#17251f99,#17251fcc),url(${a.backgroundUrl})`,
                        }
                      : undefined
                  }
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <AmenityIcon icon={a.iconKey} />
                  <h3>{a.title || "Новая карточка"}</h3>
                  <p>{a.description}</p>
                </div>
                <Field
                  label="Заголовок"
                  value={a.title}
                  max={100}
                  onChange={(v) =>
                    cards(current.amenities.map((x, j) => (j === i ? { ...x, title: v } : x)))
                  }
                />
                <Field
                  area
                  label="Описание"
                  value={a.description}
                  max={250}
                  onChange={(v) =>
                    cards(current.amenities.map((x, j) => (j === i ? { ...x, description: v } : x)))
                  }
                />
                <label>
                  Иконка
                  <select
                    value={a.iconKey}
                    onChange={(e) =>
                      cards(
                        current.amenities.map((x, j) =>
                          j === i ? { ...x, iconKey: e.target.value as any } : x,
                        ),
                      )
                    }
                  >
                    {amenityIconKeys.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <FileButton
                  disabled={!uploadEnabled || !!busy}
                  label="Загрузить фон"
                  onFile={async (f) => {
                    const asset: any = await upload(f, city);
                    if (asset)
                      cards(
                        current.amenities.map((x, j) =>
                          j === i
                            ? { ...x, backgroundUrl: asset.url, backgroundAssetId: asset.id }
                            : x,
                        ),
                      );
                  }}
                />
                <button
                  onClick={() =>
                    cards(
                      current.amenities.map((x, j) =>
                        j === i ? { ...x, backgroundUrl: null, backgroundAssetId: null } : x,
                      ),
                    )
                  }
                >
                  Убрать фон
                </button>
                <label>
                  <input
                    type="checkbox"
                    checked={a.active}
                    onChange={(e) =>
                      cards(
                        current.amenities.map((x, j) =>
                          j === i ? { ...x, active: e.target.checked } : x,
                        ),
                      )
                    }
                  />{" "}
                  Активна
                </label>
                <div>
                  <button
                    disabled={!i}
                    onClick={() => {
                      const n = [...current.amenities];
                      [n[i - 1], n[i]] = [n[i], n[i - 1]];
                      cards(n);
                    }}
                  >
                    Вверх
                  </button>
                  <button
                    disabled={i === current.amenities.length - 1}
                    onClick={() => {
                      const n = [...current.amenities];
                      [n[i + 1], n[i]] = [n[i], n[i + 1]];
                      cards(n);
                    }}
                  >
                    Вниз
                  </button>
                  <button onClick={() => cards(current.amenities.filter((_, j) => j !== i))}>
                    Удалить карточку
                  </button>
                </div>
              </article>
            ))}
          </div>
          <button
            disabled={current.amenities.length >= 12}
            onClick={() =>
              cards([
                ...current.amenities,
                {
                  id: `new-${crypto.randomUUID()}`,
                  title: "Новая карточка",
                  description: "",
                  iconKey: "none",
                  backgroundAssetId: null,
                  backgroundUrl: null,
                  active: true,
                },
              ])
            }
          >
            Добавить карточку
          </button>
        </section>
        {!uploadEnabled && (
          <p className="admin-notice">
            Загрузка и удаление файлов отключены. Текущие изображения продолжают работать.
          </p>
        )}
        <button className="admin-primary save-appearance" disabled={!!busy} onClick={save}>
          {busy === "save" ? "Сохраняем…" : "Сохранить изменения"}
        </button>
        {message && <p role="status">{message}</p>}
      </main>
    </div>
  );
}
function Field({
  label,
  value,
  max,
  onChange,
  area = false,
}: {
  label: string;
  value: string;
  max: number;
  onChange: (x: string) => void;
  area?: boolean;
}) {
  return (
    <label>
      {label}
      {area ? (
        <textarea value={value} maxLength={max} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value} maxLength={max} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}
function FileButton({
  label,
  onFile,
  disabled,
}: {
  label: string;
  onFile: (f: File) => void;
  disabled: boolean;
}) {
  return (
    <label className={`admin-upload ${disabled ? "disabled" : ""}`}>
      {label}
      <input
        disabled={disabled}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </label>
  );
}
