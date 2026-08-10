import { PageIntro } from "./PageIntro";
import type { Location } from "@/config/locations";
import type { Service } from "@/content/services";
export function BookingPreview({
  location,
  services,
}: {
  location: Location;
  services: Service[];
}) {
  return (
    <>
      <PageIntro eyebrow="Ваш визит" title={`Бронирование — ${location.name}`}>
        Город определён адресом страницы. Форма пока не отправляет и не сохраняет данные.
      </PageIntro>
      <section className="section compact">
        <div className="container booking-layout">
          <form className="booking-form" aria-label={`Макет бронирования — ${location.name}`}>
            <label>
              ФИО
              <input disabled placeholder="Как к вам обращаться" />
            </label>
            <label>
              Телефон
              <input disabled type="tel" placeholder="Номер телефона" />
            </label>
            <div className="form-row">
              <label>
                Дата
                <input disabled type="date" />
              </label>
              <label>
                Время
                <input disabled type="time" />
              </label>
            </div>
            <div className="form-row">
              <label>
                Количество гостей
                <input disabled type="number" min="1" placeholder="Например, 2" />
              </label>
              <label>
                Тип посещения
                <select disabled defaultValue="">
                  <option value="" disabled>
                    Выберите формат
                  </option>
                  {services
                    .filter((x) => x.enabled)
                    .map((x) => (
                      <option key={x.id}>{x.title}</option>
                    ))}
                </select>
              </label>
            </div>
            <label>
              Комментарий
              <textarea disabled rows={4} placeholder="Пожелания к визиту" />
            </label>
            <button className="button" disabled>
              Отправить заявку
            </button>
          </form>
          <aside className="booking-note">
            <span className="eyebrow">Важно</span>
            <h2>Пока это макет</h2>
            <p>
              Для записи позвоните:{" "}
              <a href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}>{location.phone}</a>. Backend
              появится на следующем этапе.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
