"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { getAllLocations, isLocationSlug } from "@/config/locations";
export function Footer() {
  const first = usePathname().split("/").filter(Boolean)[0];
  const current = first && isLocationSlug(first) ? first : null;
  const location = current ? getAllLocations().find((x) => x.slug === current) : null;
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          {location ? (
            <>
              <p>
                {location.address}
                <br />
                {location.phone}
                <br />
                {location.email}
              </p>
            </>
          ) : (
            <p>Один бренд — три кафе с ёжиками.</p>
          )}
        </div>
        <nav aria-label="Другие города">
          <strong>Другие города</strong>
          {getAllLocations().map((x) => (
            <Link
              className={x.slug === current ? "current-city" : ""}
              href={`/${x.slug}`}
              key={x.slug}
            >
              {x.name}
            </Link>
          ))}
        </nav>
        <div>
          <Link href="/privacy">Политика обработки данных</Link>
          <p>© {new Date().getFullYear()} «Ежеминутка»</p>
        </div>
      </div>
    </footer>
  );
}
