import type { LocationSlug } from "@/config/locations";
export type Tariff = {
  id: string;
  title: string;
  price: number | null;
  priceSuffix?: string;
  description: string;
  features?: string[];
  note?: string;
  accent?: boolean;
};
export type LocationTariffs = { cards: Tariff[]; conditions: string[] };
export const tariffsByLocation: Record<LocationSlug, LocationTariffs> = {
  moscow: {
    cards: [
      {
        id: "per-minute",
        title: "Поминутная оплата",
        price: 15,
        priceSuffix: "₽ / минута",
        description: "Минимальное посещение — 30 минут.",
        features: ["Входной билет / ежиная карта — 450 ₽"],
      },
      {
        id: "all-inclusive",
        title: "Всё включено",
        price: 1800,
        priceSuffix: "₽",
        description: "Безлимитный формат знакомства.",
        features: [
          "Входной билет и безлимитное время",
          "Кормление ёжиков",
          "Беспроигрышная лотерея",
          "Фото ёжика",
        ],
        accent: true,
      },
    ],
    conditions: ["Дети до 3 лет — бесплатно", "Абонемент на месяц — 15 000 ₽"],
  },
  spb: {
    cards: [
      {
        id: "minute-visit",
        title: "Поминутная оплата",
        price: 14,
        priceSuffix: "₽ / минута",
        description: "Оплата времени в кафе.",
        features: ["Входной билет / ежиная карта — 400 ₽"],
      },
      {
        id: "hedgehog-feeding",
        title: "Кормление ежа",
        price: 450,
        priceSuffix: "₽",
        description: "Дополнительная опция к посещению.",
        note: "Опционально",
      },
      {
        id: "inclusive-format",
        title: "Всё включено",
        price: null,
        description: "Отдельный комплексный формат.",
        note: "Стоимость не указана",
        accent: true,
      },
    ],
    conditions: ["Дети до 3 лет — бесплатно", "Абонемент на месяц — 10 000 ₽"],
  },
  kazan: {
    cards: [
      {
        id: "children-hour",
        title: "Гости 3–14 лет",
        price: 900,
        priceSuffix: "₽ / час",
        description: "Почасовая модель посещения.",
      },
      {
        id: "adult-hour",
        title: "Гости старше 14 лет",
        price: 1100,
        priceSuffix: "₽ / час",
        description: "Почасовая модель посещения.",
      },
      {
        id: "three-hours-inclusive",
        title: "Всё включено",
        price: 1500,
        priceSuffix: "₽",
        description: "Продолжительность — 3 часа.",
        features: [
          "Ежиная карта",
          "Кормление ёжика",
          "Беспроигрышная лотерея",
          "Скидка на сувениры",
        ],
        accent: true,
      },
    ],
    conditions: ["Дети до 3 лет — бесплатно", "Абонемент — 10 000 ₽"],
  },
};
