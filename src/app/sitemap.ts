import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";
import { routeSlug } from "@/lib/slug";

const BASE = "https://rutapacificocr.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/private-shuttle`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic route pages from Supabase
  const routePages: MetadataRoute.Sitemap = [];
  try {
    const { data } = await getSupabase()
      .from("routes")
      .select("origen, destino")
      .order("origen", { ascending: true });

    if (data) {
      for (const route of data) {
        routePages.push({
          url: `${BASE}/private-shuttle/${routeSlug(route.origen, route.destino)}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // If DB is unreachable, return static pages only
  }

  return [...staticPages, ...routePages];
}
