import { CitySelector } from "@/components/CitySelector";
export default function Home() {
  return (
    <>
      <section className="network-hero">
        <div className="container narrow">
          <span className="eyebrow">Ежеминутка</span>
          <h1>Тайм-кафе с ёжиками</h1>
          <p className="lead">
            Три города — одна любовь к колючим. Выберите город и познакомьтесь с вашей
            «Ежеминуткой».
          </p>
        </div>
      </section>
      <section className="section compact" id="locations">
        <div className="container">
          <CitySelector />
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">О бренде</span>
            <h2>Место для необычной паузы</h2>
          </div>
          <p className="lead">
            «Ежеминутка» — сеть тайм-кафе с живыми ёжиками, играми и уютным пространством для
            отдыха. Доступные форматы отличаются в каждом городе.
          </p>
        </div>
      </section>
    </>
  );
}
