import type { LocationSlug } from "@/config/locations";
export type ServiceId =
  | "regularVisit"
  | "date"
  | "birthday"
  | "childrenParty"
  | "excursion"
  | "quest"
  | "photoSession"
  | "rent"
  | "coworking";
export type Service = { id: ServiceId; title: string; enabled: boolean };
const titles: Record<ServiceId, string> = {
  regularVisit: "Обычное посещение",
  date: "Свидание",
  birthday: "День рождения",
  childrenParty: "Детский праздник",
  excursion: "Экскурсия",
  quest: "Квест",
  photoSession: "Фотосессия",
  rent: "Аренда кафе",
  coworking: "Коворкинг",
};
const make = (enabled: ServiceId[]): Service[] =>
  Object.entries(titles).map(([id, title]) => ({
    id: id as ServiceId,
    title,
    enabled: enabled.includes(id as ServiceId),
  }));
const allServices = Object.keys(titles) as ServiceId[];
export const servicesByLocation: Record<LocationSlug, Service[]> = {
  moscow: make(allServices),
  spb: make(allServices),
  kazan: make(allServices),
};
