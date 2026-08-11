import type { ReactNode } from "react";

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

const drawings: Record<Exclude<AmenityIconKey, "none">, ReactNode> = {
  hedgehog: (
    <>
      <path d="M4 15c-1-3 0-7 3-9l1 3 2-5 2 4 3-3 1 4c3 1 5 3 5 6 0 3-3 5-7 5H9c-3 0-5-2-5-5Z" />
      <path d="M16 14h.01M20 16h1" />
    </>
  ),
  tea: (
    <>
      <path d="M5 10h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5v-5Z" />
      <path d="M17 12h1a3 3 0 0 1 0 6h-2M8 3c2 2-1 3 1 5M13 3c2 2-1 3 1 5" />
    </>
  ),
  "board-games": (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="9" cy="9" r="1" />
      <circle cx="15" cy="15" r="1" />
      <path d="m14 7 3 3M7 14l3 3" />
    </>
  ),
  console: (
    <>
      <path d="M7 9h10a5 5 0 0 1 4 6l-1 4a2 2 0 0 1-3 1l-3-2h-4l-3 2a2 2 0 0 1-3-1l-1-4a5 5 0 0 1 4-6Z" />
      <path d="M8 12v4M6 14h4M16 13h.01M18 15h.01" />
    </>
  ),
  wifi: (
    <>
      <path d="M4 9a12 12 0 0 1 16 0M7 13a8 8 0 0 1 10 0M10 17a3 3 0 0 1 4 0" />
      <circle cx="12" cy="20" r=".5" fill="currentColor" />
    </>
  ),
  lounge: (
    <>
      <path d="M5 12V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M4 12a2 2 0 0 0-2 2v5h20v-5a2 2 0 0 0-4 0v1H6v-1a2 2 0 0 0-2-2ZM5 19v2M19 19v2" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h4l2-3h4l2 3h4a2 2 0 0 1 2 2v9H2v-9a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="14" r="4" />
    </>
  ),
  birthday: (
    <>
      <path d="M5 12h14v9H5zM4 12h16M8 12V8M12 12V8M16 12V8M7 17h10" />
      <path d="M8 5c-1-1 0-2 0-3 1 1 2 2 0 3ZM12 5c-1-1 0-2 0-3 1 1 2 2 0 3ZM16 5c-1-1 0-2 0-3 1 1 2 2 0 3Z" />
    </>
  ),
  star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
};

export function AmenityIcon({ icon }: { icon: AmenityIconKey }) {
  if (icon === "none") return null;
  return (
    <svg
      className="amenity-icon"
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {drawings[icon]}
    </svg>
  );
}
