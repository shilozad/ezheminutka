"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminContext } from "@/lib/admin-auth";
import type { AdminBooking } from "@/lib/admin-bookings";
import { servicesByLocation } from "@/content/services";
import type { LocationSlug } from "@/config/locations";
import { AdminHeader } from "./AdminHeader";
const cities = { moscow: "Москва", spb: "Санкт-Петербург", kazan: "Казань" },
  statuses = {
    NEW: "Новая",
    CONFIRMED: "Подтверждена",
    CANCELLED: "Отменена",
    COMPLETED: "Завершена",
  };
export default function AdminDashboard({
  admin,
  initialBookings,
}: {
  admin: AdminContext;
  initialBookings: AdminBooking[];
}) {
  const router = useRouter(),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState(""),
    [city, setCity] = useState(""),
    [editing, setEditing] = useState<AdminBooking | null | "new">(null);
  const list = useMemo(
    () =>
      initialBookings.filter(
        (b) =>
          (!city || b.locationId === city) &&
          (!status || b.status === status) &&
          (!search ||
            `${b.fullName} ${b.phone} ${b.publicNumber}`
              .toLowerCase()
              .includes(search.toLowerCase())),
      ),
    [initialBookings, search, status, city],
  );
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }
  return (
    <div className="admin-page">
      <AdminHeader admin={admin} subtitle="Управление бронированиями" />
      <section className="admin-content">
        <div className="admin-title">
          <h1>Управление бронированиями</h1>
          <button className="admin-primary" onClick={() => setEditing("new")}>
            Добавить бронь
          </button>
        </div>
        {admin.role === "SUPERADMIN" && (
          <div className="admin-city-tabs">
            {[["", "Все кафе"], ...Object.entries(cities)].map(([id, name]) => (
              <button className={city === id ? "active" : ""} onClick={() => setCity(id)} key={id}>
                {name}
              </button>
            ))}
          </div>
        )}
        <div className="admin-stats">
          <Stat n={list.filter((x) => x.status === "NEW").length} t="Новые" />
          <Stat n={list.filter((x) => x.status === "CONFIRMED").length} t="Подтверждённые" />
          <Stat n={list.filter((x) => x.visitDate === today).length} t="Сегодня" />
          <Stat n={list.filter((x) => x.visitDate >= today).length} t="Предстоящие" />
        </div>
        <div className="admin-filters">
          <input
            aria-label="Поиск"
            placeholder="ФИО, телефон или номер"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select aria-label="Статус" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Все статусы</option>
            {Object.entries(statuses).map(([x, n]) => (
              <option key={x} value={x}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-booking-list">
          {list.map((b) => (
            <article className="admin-booking-card" key={b.id}>
              <div>
                <b>{b.publicNumber}</b>
                <span className={`admin-status ${b.status.toLowerCase()}`}>
                  {statuses[b.status as keyof typeof statuses]}
                </span>
              </div>
              <h3>
                {b.visitDate} · {b.visitTime} — {b.fullName}
              </h3>
              <p>
                {cities[b.locationId as LocationSlug]} · {b.guestCount} гост. · {b.phone}
              </p>
              <details>
                <summary>Подробнее</summary>
                <p>
                  {
                    servicesByLocation[b.locationId as LocationSlug].find(
                      (x) => x.id === b.visitType,
                    )?.title
                  }{" "}
                  · {b.source === "PUBLIC" ? "С сайта" : "Создано администратором"}
                </p>
                {b.comment && <p>Комментарий: {b.comment}</p>}
                {b.adminNote && <p>Заметка: {b.adminNote}</p>}
                <small>Создано: {new Date(b.createdAt).toLocaleString("ru-RU")}</small>
              </details>
              <button onClick={() => setEditing(b)}>Редактировать</button>
            </article>
          ))}
        </div>
      </section>
      {editing && (
        <BookingModal
          admin={admin}
          booking={editing === "new" ? null : editing}
          close={() => setEditing(null)}
          refresh={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
function Stat({ n, t }: { n: number; t: string }) {
  return (
    <div>
      <strong>{n}</strong>
      <span>{t}</span>
    </div>
  );
}
function BookingModal({
  admin,
  booking,
  close,
  refresh,
}: {
  admin: AdminContext;
  booking: AdminBooking | null;
  close: () => void;
  refresh: () => void;
}) {
  const defaultCity = (booking?.locationId || admin.allowedLocations[0]) as LocationSlug,
    [location, setLocation] = useState(defaultCity),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false),
    [deleting, setDeleting] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving || deleting) return;
    setSaving(true);
    setError("");
    const f = new FormData(e.currentTarget),
      body = Object.fromEntries(f);
    body.guestCount = Number(body.guestCount) as never;
    try {
      const response = await fetch(
        booking ? `/api/admin/bookings/${booking.id}` : "/api/admin/bookings",
        {
          method: booking ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (response.ok) refresh();
      else setError((await response.json()).error.message);
    } catch {
      setError("Сервис временно недоступен.");
    } finally {
      setSaving(false);
    }
  }
  async function remove() {
    if (
      saving ||
      deleting ||
      !booking ||
      !confirm(`Удалить бронь ${booking.publicNumber}? Это действие нельзя отменить.`)
    )
      return;
    setDeleting(true);
    setError("");
    try {
      const r = await fetch(`/api/admin/bookings/${booking.id}`, { method: "DELETE" });
      r.ok ? refresh() : setError((await r.json()).error.message);
    } catch {
      setError("Сервис временно недоступен.");
    } finally {
      setDeleting(false);
    }
  }
  return (
    <div className="admin-modal" role="dialog">
      <form onSubmit={submit}>
        <button type="button" className="admin-close" onClick={close}>
          ×
        </button>
        <h2>{booking ? "Редактировать бронь" : "Добавить бронь"}</h2>
        <label>
          Город
          <select
            name="locationId"
            value={location}
            disabled={admin.role !== "SUPERADMIN"}
            onChange={(e) => setLocation(e.target.value as LocationSlug)}
          >
            {admin.allowedLocations.map((x) => (
              <option key={x} value={x}>
                {cities[x]}
              </option>
            ))}
          </select>
          {admin.role !== "SUPERADMIN" && (
            <input type="hidden" name="locationId" value={location} />
          )}
        </label>
        <label>
          ФИО
          <input name="fullName" defaultValue={booking?.fullName} required />
        </label>
        <label>
          Телефон
          <input name="phone" defaultValue={booking?.phone} required />
        </label>
        <div className="admin-form-row">
          <label>
            Дата
            <input type="date" name="visitDate" defaultValue={booking?.visitDate} required />
          </label>
          <label>
            Время
            <input type="time" name="visitTime" defaultValue={booking?.visitTime} required />
          </label>
          <label>
            Гостей
            <input
              type="number"
              min="1"
              max="50"
              name="guestCount"
              defaultValue={booking?.guestCount || 1}
              required
            />
          </label>
        </div>
        <label>
          Тип посещения
          <select name="visitType" defaultValue={booking?.visitType}>
            {servicesByLocation[location]
              .filter((x) => x.enabled)
              .map((x) => (
                <option key={x.id} value={x.id}>
                  {x.title}
                </option>
              ))}
          </select>
        </label>
        <label>
          Статус
          <select name="status" defaultValue={booking?.status || "NEW"}>
            {Object.entries(statuses).map(([x, n]) => (
              <option key={x} value={x}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          Комментарий
          <textarea name="comment" defaultValue={booking?.comment || ""} />
        </label>
        <label>
          Заметка администратора
          <textarea name="adminNote" defaultValue={booking?.adminNote || ""} />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-actions">
          <button className="admin-primary" disabled={saving || deleting}>
            {saving ? "Сохраняем…" : "Сохранить"}
          </button>
          {booking && (
            <button
              type="button"
              className="admin-danger"
              onClick={remove}
              disabled={saving || deleting}
            >
              {deleting ? "Удаляем…" : "Удалить"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
