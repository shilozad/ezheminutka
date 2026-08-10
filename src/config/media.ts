export type MediaSource = string | null;

export const mediaConfig: Record<
  "hero" | "interior1" | "interior2" | "hedgehog1" | "hedgehog2" | "event1" | "event2" | "ogCover",
  MediaSource
> = {
  hero: null,
  interior1: null,
  interior2: null,
  hedgehog1: null,
  hedgehog2: null,
  event1: null,
  event2: null,
  ogCover: null,
};
