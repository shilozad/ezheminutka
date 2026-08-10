import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
export const metadata: Metadata = { title: "Бронирование" };
export default function BookingPage() {
  return (
    <>
      <PageIntro eyebrow="Ваш визит" title="Бронирование">
        Форма уже показывает, какие данные понадобятся. Отправку подключим на следующем этапе —
        сейчас данные никуда не передаются.
      </PageIntro>
      <section className="section compact">
        <div className="container booking-layout">
          <form className="booking-form" aria-label="Предварительный вид формы бронирования">
            <label>
              ФИО
              <input type="text" placeholder="Как к вам обращаться" disabled />
            </label>
            <label>
              Телефон
              <input type="tel" placeholder="Номер телефона" disabled />
            </label>
            <div className="form-row">
              <label>
                Дата
                <input type="date" disabled />
              </label>
              <label>
                Время
                <input type="time" disabled />
              </label>
            </div>
            <div className="form-row">
              <label>
                Количество гостей
                <input type="number" placeholder="Например, 2" disabled />
              </label>
              <label>
                Тип посещения
                <select disabled defaultValue="">
                  <option value="" disabled>
                    Выберите формат
                  </option>
                  <option>Обычное посещение</option>
                  <option>Безлимит</option>
                  <option>День рождения</option>
                  <option>Аренда кафе</option>
                </select>
              </label>
            </div>
            <label>
              Комментарий
              <textarea placeholder="Пожелания к визиту" rows={4} disabled />
            </label>
            <div className="submit-row">
              <button className="button" type="submit" disabled>
                Отправить заявку
              </button>
              <p>Онлайн-бронирование подключаем</p>
            </div>
          </form>
          <aside className="booking-note">
            <span className="eyebrow">Важно</span>
            <h2>Пока это только макет</h2>
            <p>
              Форма не отправляет и не сохраняет данные. Телефон кафе появится здесь после
              уточнения.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
