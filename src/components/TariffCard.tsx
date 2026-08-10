import Link from "next/link";
import type { Tariff } from "@/content/tariffs";
export function TariffCard({ tariff, bookingHref }: { tariff: Tariff; bookingHref: string }) {
  return (
    <article className={`tariff ${tariff.accent ? "accent" : ""}`}>
      <h3>{tariff.title}</h3>
      <p>{tariff.description}</p>
      <strong>
        {tariff.price === null
          ? "Без указанной стоимости"
          : `${tariff.price.toLocaleString("ru-RU")} ${tariff.priceSuffix ?? "₽"}`}
      </strong>
      {tariff.features && (
        <ul>
          {tariff.features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {tariff.note && <p>{tariff.note}</p>}
      <Link href={bookingHref}>Выбрать формат →</Link>
    </article>
  );
}
