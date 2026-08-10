import type { MetadataRoute } from "next";
import { getAllLocations } from "@/config/locations";
import { siteConfig } from "@/config/site";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.siteUrl) return [];
  const common = ["", "/gallery", "/news", "/booking", "/privacy"];
  const city = getAllLocations().flatMap(({ slug }) =>
    ["", "/gallery", "/news", "/booking"].map((part) => `/${slug}${part}`),
  );
  return [...common, ...city].map((path) => ({ url: `${siteConfig.siteUrl}${path}` }));
}
