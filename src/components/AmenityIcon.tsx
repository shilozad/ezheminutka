export const amenityIconKeys = [
  "hedgehog",
  "tea",
  "board-games",
  "console",
  "wifi",
  "lounge",
  "camera",
  "birthday",
  "star",
  "none",
] as const;
export type AmenityIconKey = (typeof amenityIconKeys)[number];
export function AmenityIcon({ icon }: { icon: AmenityIconKey }) {
  if (icon === "none") return null;
  const symbols: Record<Exclude<AmenityIconKey, "none">, string> = {
    hedgehog: "◒",
    tea: "♨",
    "board-games": "◇",
    console: "⌘",
    wifi: "⌁",
    lounge: "⌂",
    camera: "▣",
    birthday: "♧",
    star: "☆",
  };
  return (
    <span className="amenity-icon" aria-hidden="true">
      {symbols[icon]}
    </span>
  );
}
