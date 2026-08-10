import { PageIntro } from "./PageIntro";
import type { Location } from "@/config/locations";
export function CityNews({ location }: { location: Location }) {
  return (
    <>
      <PageIntro eyebrow="Жизнь кафе" title={`Новости — ${location.name}`}>
        Анонсы и важные обновления кафе в {location.cityPrepositional} будут собраны здесь.
      </PageIntro>
      <section className="section compact">
        <div className="container narrow">
          <div className="empty-state large">
            <span className="media-mark" aria-hidden="true" />
            <div>
              <h2>Новости уже в пути</h2>
              <p>
                В будущем у города будет отдельный источник новостей. VK API сейчас не подключён.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
