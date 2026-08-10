"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Location } from "@/config/locations";
import type { Service } from "@/content/services";

type Status = "idle" | "submitting" | "success" | "error";

export function BookingForm({
  location,
  services,
  enabled,
}: {
  location: Location;
  services: Service[];
  enabled: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [publicNumber, setPublicNumber] = useState("");
  const unavailableMessage =
    "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с кафе по телефону.";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || status === "submitting") return;
    setStatus("submitting");
    setMessage("");

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      locationId: location.slug,
      fullName: form.get("fullName"),
      phone: form.get("phone"),
      visitDate: form.get("visitDate"),
      visitTime: form.get("visitTime"),
      guestCount: Number(form.get("guestCount")),
      visitType: form.get("visitType"),
      comment: form.get("comment"),
      consent: form.get("consent") === "on",
      website: form.get("website"),
    };

    try {
      const result = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await result.json()) as {
        ok: boolean;
        booking?: { publicNumber: string };
        error?: { message: string };
      };
      if (!result.ok || !data.ok || !data.booking) {
        setMessage(
          result.status >= 500 ? unavailableMessage : data.error?.message || unavailableMessage,
        );
        setStatus("error");
        return;
      }
      setPublicNumber(data.booking.publicNumber);
      setStatus("success");
      formElement.reset();
    } catch {
      setMessage(unavailableMessage);
      setStatus("error");
    }
  }

  const disabled = !enabled || status === "submitting";

  return (
    <form className="booking-form" aria-label={`Бронирование — ${location.name}`} onSubmit={submit}>
      <fieldset disabled={disabled}>
        <label>
          ФИО *
          <input
            name="fullName"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            placeholder="Как к вам обращаться"
          />
        </label>
        <label>
          Телефон *
          <input
            name="phone"
            required
            type="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
          />
        </label>
        <div className="form-row">
          <label>
            Дата *
            <input name="visitDate" required type="date" />
          </label>
          <label>
            Время *
            <input name="visitTime" required type="time" />
          </label>
        </div>
        <div className="form-row">
          <label>
            Количество гостей *
            <input
              name="guestCount"
              required
              type="number"
              min="1"
              max="50"
              placeholder="Например, 2"
            />
          </label>
          <label>
            Тип посещения *
            <select name="visitType" required defaultValue="">
              <option value="" disabled>
                Выберите формат
              </option>
              {services
                .filter(({ enabled }) => enabled)
                .map(({ id, title }) => (
                  <option key={id} value={id}>
                    {title}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <label>
          Комментарий
          <textarea name="comment" rows={4} maxLength={1000} placeholder="Пожелания к визиту" />
        </label>
        <label className="honeypot" aria-hidden="true">
          Ваш сайт
          <input name="website" autoComplete="off" tabIndex={-1} />
        </label>
        <label className="consent-field">
          <input name="consent" type="checkbox" required />
          <span>
            Я согласен на <Link href="/privacy">обработку персональных данных</Link> *
          </span>
        </label>
        <button className="button" type="submit">
          {status === "submitting" ? "Отправляем…" : "Отправить заявку"}
        </button>
      </fieldset>

      {status === "success" && (
        <div className="form-message success" role="status">
          <strong>Заявка принята</strong>
          <span>Номер: {publicNumber}</span>
          <span>Бронирование считается подтверждённым после связи с администратором.</span>
        </div>
      )}
      {status === "error" && (
        <p className="form-message error" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
