import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
export const metadata: Metadata = { title: "Новости" };
export default function NewsPage() {
  return (
    <>
      <PageIntro eyebrow="Жизнь кафе" title="Новости Ежеминутки">
        Анонсы событий, знакомства с ёжиками и важные обновления скоро будут собраны здесь.
      </PageIntro>
      <section className="section compact">
        <div className="container narrow">
          <div className="empty-state large">
            <span className="media-mark" aria-hidden="true" />
            <div>
              <h2>Новости уже в пути</h2>
              <p>
                Здесь будут появляться свежие новости из нашей группы VK. Подключение VK
                запланировано на следующий этап.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
