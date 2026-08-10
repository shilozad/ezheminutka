"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllLocations, isLocationSlug } from "@/config/locations";
import { Logo } from "./Logo";
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const parts = pathname.split("/").filter(Boolean);
  const slug = parts[0] && isLocationSlug(parts[0]) ? parts[0] : null;
  const section = ["gallery", "news", "booking"].includes(parts[1]) ? `/${parts[1]}` : "";
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);
  const close = () => setOpen(false);
  const cityLinks = slug
    ? [
        ["О кафе", `/${slug}#about`],
        ["Тарифы", `/${slug}#tariffs`],
        ["Возможности", `/${slug}#occasions`],
        ["Галерея", `/${slug}/gallery`],
        ["Новости", `/${slug}/news`],
        ["Контакты", `/${slug}#contacts`],
      ]
    : [["Наши кафе", "/#locations"]];
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand-cluster">
          <Logo />
          {slug && (
            <details className="city-switcher">
              <summary>{getAllLocations().find((x) => x.slug === slug)?.name}</summary>
              <div>
                {getAllLocations().map((x) => (
                  <Link href={`/${x.slug}${section}`} key={x.slug}>
                    {x.name}
                  </Link>
                ))}
              </div>
            </details>
          )}
        </div>
        <button
          className="menu-toggle"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={open ? "nav open" : "nav"} aria-label="Основная навигация">
          {cityLinks.map(([label, href]) => (
            <Link key={href} href={href} onClick={close}>
              {label}
            </Link>
          ))}
          {slug && (
            <Link className="button button-small" href={`/${slug}/booking`} onClick={close}>
              Забронировать
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
