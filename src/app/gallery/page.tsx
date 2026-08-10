import { PageIntro } from "@/components/PageIntro";
import { CitySelector } from "@/components/CitySelector";
export default function Page() {
  return (
    <>
      <PageIntro eyebrow="Галерея" title="Выберите город">
        У каждого кафе — своё пространство, ёжики и фотогалерея.
      </PageIntro>
      <section className="section compact">
        <div className="container">
          <CitySelector suffix="/gallery" compact />
        </div>
      </section>
    </>
  );
}
