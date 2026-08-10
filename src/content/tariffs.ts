export type Tariff = { id: string; title: string; price: number | null; priceSuffix: string | null; description: string; features: string[]; accent: boolean };
export const tariffs: Tariff[] = [
  { id: "visit", title: "Обычное посещение", price: null, priceSuffix: null, description: "Для первого знакомства и спокойного отдыха.", features: ["Общение с ёжиками", "Чай, печенье и игры"], accent: false },
  { id: "unlimited", title: "Безлимит", price: null, priceSuffix: null, description: "Когда хочется никуда не торопиться.", features: ["Больше времени вместе", "Вся зона отдыха"], accent: true },
  { id: "birthday", title: "День рождения", price: null, priceSuffix: null, description: "Тёплый праздник для небольшой компании.", features: ["Праздничный формат", "Помощь администратора"], accent: false },
  { id: "rent", title: "Аренда кафе", price: null, priceSuffix: null, description: "Пространство целиком для вашего события.", features: ["Закрытый формат", "Гибкий сценарий встречи"], accent: false },
];
