import { PageIntro } from "@/components/PageIntro";
import { CitySelector } from "@/components/CitySelector";
export default function Page() {
  return (
    <>
      <PageIntro eyebrow="Бронирование" title="В каком городе хотите нас посетить?">
        Выберите кафе — город станет частью адреса будущей заявки.
      </PageIntro>
      <section className="section compact">
        <div className="container">
          <CitySelector suffix="/booking" compact />
        </div>
      </section>
    </>
  );
}
