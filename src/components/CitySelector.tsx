import Link from "next/link";
import { getAllLocations } from "@/config/locations";
export function CitySelector({
  suffix = "",
  compact = false,
}: {
  suffix?: "" | "/booking" | "/gallery" | "/news";
  compact?: boolean;
}) {
  return (
    <div className={`city-grid ${compact ? "city-grid-compact" : ""}`}>
      {getAllLocations().map((location) => (
        <Link className="city-card" href={`/${location.slug}${suffix}`} key={location.slug}>
          <span className="media-mark" aria-hidden="true" />
          <span className="eyebrow">Тайм-кафе</span>
          <h2>{location.name}</h2>
          <p>{location.addressShort}</p>
          <strong>Выбрать город →</strong>
        </Link>
      ))}
    </div>
  );
}
