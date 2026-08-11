"use client";
import { useState } from "react";
import type { AdminContext } from "@/lib/admin-auth";
import type { AdminGalleryItem } from "@/lib/admin-gallery";
import { AdminHeader } from "./AdminHeader";
const names = { moscow: "Москва", spb: "Санкт-Петербург", kazan: "Казань" };
export default function GalleryEditor({
  admin,
  initial,
  uploadEnabled,
}: {
  admin: AdminContext;
  initial: Record<string, AdminGalleryItem[]>;
  uploadEnabled: boolean;
}) {
  const [city, setCity] = useState(admin.allowedLocations[0]),
    [data, setData] = useState(initial),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const items = data[city] ?? [];
  const setItems = (value: AdminGalleryItem[]) => setData((x) => ({ ...x, [city]: value }));
  const patch = (id: string, value: Partial<AdminGalleryItem>) =>
    setItems(items.map((x) => (x.id === id ? { ...x, ...value } : x)));
  const move = (i: number, d: number) => {
    const next = [...items],
      j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };
  async function add(file: File) {
    setBusy(true);
    setMessage("Загружаем…");
    let assetId: string | undefined;
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("locationId", city);
      const upload = await fetch("/api/admin/media", { method: "POST", body: form }),
        u = await upload.json();
      if (!upload.ok) throw new Error(u.error?.message);
      assetId = u.asset.id;
      const create = await fetch(`/api/admin/gallery/${city}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            mediaAssetId: assetId,
            title: file.name.replace(/\.[^.]+$/, "").slice(0, 140) || "Фотография",
            altText: `Фотография кафе ${names[city]}`,
            caption: null,
          }),
        }),
        c = await create.json();
      if (!create.ok) {
        await fetch(`/api/admin/media/${assetId}`, { method: "DELETE" }).catch(() => {});
        throw new Error(c.error?.message);
      }
      setItems([...items, { ...c.item, imageUrl: u.asset.url }]);
      setMessage("Фотография добавлена");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/gallery/${city}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ items }),
        }),
        j = await r.json();
      if (!r.ok) throw new Error(j.error?.message);
      setMessage("Галерея сохранена");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  }
  async function remove(item: AdminGalleryItem) {
    if (!confirm("Удалить фотографию из галереи?")) return;
    const r = await fetch(`/api/admin/gallery/${city}/${encodeURIComponent(item.id)}`, {
      method: "DELETE",
    });
    if (!r.ok) {
      setMessage("Не удалось удалить фотографию");
      return;
    }
    setItems(items.filter((x) => x.id !== item.id));
    if (item.mediaAssetId)
      await fetch(`/api/admin/media/${item.mediaAssetId}`, { method: "DELETE" }).catch(() => {});
    setMessage("Фотография удалена");
  }
  return (
    <div className="admin-page">
      <AdminHeader admin={admin} subtitle="Галерея" />
      <main className="admin-content gallery-admin">
        <div className="admin-title">
          <div>
            <h1>Галерея</h1>
            <p>
              Лучше использовать фотографии от 1200 px по длинной стороне. JPEG/WebP/PNG, до 8 МБ.
            </p>
          </div>
          <label className={`button admin-upload ${!uploadEnabled ? "disabled" : ""}`}>
            Добавить фотографию
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={!uploadEnabled || busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) add(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {admin.role === "SUPERADMIN" && (
          <div className="admin-city-tabs">
            {admin.allowedLocations.map((x) => (
              <button key={x} className={city === x ? "active" : ""} onClick={() => setCity(x)}>
                {names[x]}
              </button>
            ))}
          </div>
        )}
        {!items.length && <div className="gallery-empty">В галерее пока нет фотографий.</div>}
        <div className="gallery-editors">
          {items.map((item, i) => (
            <article className="gallery-editor" key={item.id}>
              <div className="admin-gallery-preview">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.altText} />
                ) : (
                  <span>Фото скоро появится</span>
                )}
              </div>
              <div className="gallery-fields">
                <label>
                  Название
                  <input
                    value={item.title}
                    maxLength={140}
                    onChange={(e) => patch(item.id, { title: e.target.value })}
                  />
                </label>
                <label>
                  Alt-текст
                  <input
                    value={item.altText}
                    maxLength={300}
                    onChange={(e) => patch(item.id, { altText: e.target.value })}
                  />
                </label>
                <label>
                  Подпись
                  <textarea
                    value={item.caption ?? ""}
                    maxLength={400}
                    onChange={(e) => patch(item.id, { caption: e.target.value || null })}
                  />
                </label>
                <div className="gallery-checks">
                  <label>
                    <input
                      type="checkbox"
                      checked={item.featured}
                      onChange={(e) => patch(item.id, { featured: e.target.checked })}
                    />{" "}
                    Показывать крупнее
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) => patch(item.id, { active: e.target.checked })}
                    />{" "}
                    Показывать на сайте
                  </label>
                </div>
                <div className="gallery-actions">
                  <button onClick={() => move(i, -1)} disabled={i === 0}>
                    Вверх
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                    Вниз
                  </button>
                  <button className="admin-danger" onClick={() => remove(item)}>
                    Удалить
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="gallery-save">
          <button className="admin-primary" disabled={busy} onClick={save}>
            Сохранить изменения
          </button>
          {message && <span role="status">{message}</span>}
        </div>
      </main>
    </div>
  );
}
