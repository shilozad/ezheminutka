import { PageIntro } from "@/components/PageIntro";
import { CitySelector } from "@/components/CitySelector";
export default function Page() {
  return (
    <>
      <PageIntro eyebrow="Новости" title="Выберите город">
        Новости и события каждого кафе будут публиковаться отдельно.
      </PageIntro>
      <section className="section compact">
        <div className="container">
          <CitySelector suffix="/news" compact />
        </div>
      </section>
    </>
  );
}
