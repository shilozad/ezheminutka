import type { LocationSlug } from "./locations";
export type MediaSource = string | null;
export type LocationMedia = Record<
  "hero" | "interior1" | "interior2" | "hedgehog1" | "hedgehog2" | "event1" | "event2" | "ogCover",
  MediaSource
>;
const emptyMedia = (): LocationMedia => ({
  hero: null,
  interior1: null,
  interior2: null,
  hedgehog1: null,
  hedgehog2: null,
  event1: null,
  event2: null,
  ogCover: null,
});
export const mediaByLocation: Record<LocationSlug, LocationMedia> = {
  moscow: emptyMedia(),
  spb: emptyMedia(),
  kazan: emptyMedia(),
};
