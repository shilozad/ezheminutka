import Link from "next/link";
import { Logo } from "./Logo";
import { siteConfig } from "@/config/site";
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>{siteConfig.address}</p>
        </div>
        <nav aria-label="Навигация в подвале">
          <Link href="/#about">О кафе</Link>
          <Link href="/#tariffs">Тарифы</Link>
          <Link href="/gallery">Галерея</Link>
          <Link href="/news">Новости</Link>
        </nav>
        <div>
          <Link href="/privacy">Политика обработки данных</Link>
          <p>© {new Date().getFullYear()} «Ежеминутка»</p>
        </div>
      </div>
    </footer>
  );
}
