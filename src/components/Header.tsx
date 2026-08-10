"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
const links = [["О кафе", "/#about"], ["Тарифы", "/#tariffs"], ["Возможности", "/#occasions"], ["Галерея", "/gallery"], ["Новости", "/news"], ["Контакты", "/#contacts"]];
export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.classList.toggle("menu-open", open); return () => document.body.classList.remove("menu-open"); }, [open]);
  return <header className="header"><div className="container header-inner"><Logo /><button className="menu-toggle" aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} onClick={() => setOpen(!open)}><span/><span/><span/></button><nav className={open ? "nav open" : "nav"} aria-label="Основная навигация">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link className="button button-small" href="/booking" onClick={() => setOpen(false)}>Забронировать</Link></nav></div></header>;
}
