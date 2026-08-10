export type LocationSlug = "moscow" | "spb" | "kazan";

export type Location = {
  slug: LocationSlug;
  name: string;
  city: string;
  cityPrepositional: string;
  heroTitle: string;
  description: string;
  address: string;
  addressShort: string;
  floor: number | null;
  metro: string | null;
  phone: string;
  email: string;
  openingHours: string;
  vkUrl: string | null;
  mapUrl: string | null;
};

export const locations: Record<LocationSlug, Location> = {
  moscow: {
    slug: "moscow",
    name: "Москва",
    city: "Москва",
    cityPrepositional: "Москве",
    heroTitle: "Тайм-кафе с ёжиками в Москве",
    description: "Живые ёжики, уют, игры и необычный отдых в Москве.",
    address: "Москва, ул. Маросейка, 2/15с1",
    addressShort: "ул. Маросейка, 2/15с1",
    floor: 3,
    metro: "Китай-город",
    phone: "+7 (926) 126-41-21",
    email: "info@ejeminutka.ru",
    openingHours: "11:00–23:00",
    vkUrl: null,
    mapUrl: null,
  },
  spb: {
    slug: "spb",
    name: "Санкт-Петербург",
    city: "Санкт-Петербург",
    cityPrepositional: "Санкт-Петербурге",
    heroTitle: "Тайм-кафе с ёжиками в центре Петербурга",
    description: "Живые ёжики, уют, игры и необычный отдых в Санкт-Петербурге.",
    address: "Санкт-Петербург, Владимирский проспект, 1/47",
    addressShort: "Владимирский проспект, 1/47",
    floor: null,
    metro: "Маяковская",
    phone: "+7 (952) 204-71-41",
    email: "spb@ejeminutka.ru",
    openingHours: "10:00–22:00",
    vkUrl: null,
    mapUrl: null,
  },
  kazan: {
    slug: "kazan",
    name: "Казань",
    city: "Казань",
    cityPrepositional: "Казани",
    heroTitle: "Тайм-кафе с ёжиками в Казани",
    description: "Живые ёжики, уют, игры и необычный отдых в Казани.",
    address: "Казань, Университетская ул., 34/29",
    addressShort: "Университетская ул., 34/29",
    floor: null,
    metro: "Площадь Габдуллы Тукая",
    phone: "+7 (939) 732-18-32",
    email: "kzn@ejeminutka.ru",
    openingHours: "10:00–22:00",
    vkUrl: null,
    mapUrl: null,
  },
};

export function isLocationSlug(value: string): value is LocationSlug {
  return value in locations;
}
export function getLocation(slug: LocationSlug): Location {
  return locations[slug];
}
export function getAllLocations(): Location[] {
  return Object.values(locations);
}
export const locationStaticParams = () => getAllLocations().map(({ slug }) => ({ city: slug }));
