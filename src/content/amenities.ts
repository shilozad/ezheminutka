import type { AmenityIconKey } from "@/components/AmenityIcon";

export type AmenityPresentation = {
  id: string;
  title: string;
  description: string;
  iconKey: AmenityIconKey;
  backgroundAssetId: string | null;
  backgroundUrl: string | null;
  active: boolean;
};
const data = [
  ["hedgehog", "Ёжики", "Бережное общение с главными хозяевами."],
  ["tea", "Чай и печенье", "Тёплое дополнение к неспешной встрече."],
  ["board-games", "Настольные игры", "Для двоих, семьи или компании."],
  ["console", "Игровые приставки", "Для дружеского турнира."],
  ["wifi", "Wi-Fi", "Оставайтесь на связи."],
  ["lounge", "Уютное пространство", "Для отдыха и разговоров."],
] as const;
export const defaultAmenities: AmenityPresentation[] = data.map(
  ([iconKey, title, description], index) => ({
    id: `default-${index + 1}`,
    iconKey,
    title,
    description,
    backgroundAssetId: null,
    backgroundUrl: null,
    active: true,
  }),
);
