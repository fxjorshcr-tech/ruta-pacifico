import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";
import { routeSlug } from "@/lib/slug";
import { getRoutes } from "@/lib/routes";
import {
  getDestinations,
  routeSitemapPriority,
  selectIndexableRoutes,
} from "@/lib/destinations";

/** Re-generate at most hourly so new destinations/routes appear without a deploy. */
export const revalidate = 3600;

const BASE = "https://rutapacifico.com";

/**
 * Last real content change on the static pages. Google and Bing ignore
 * <lastmod> entirely when it is stamped with "now" on every crawl, so this
 * is a fixed date — bump it when the copy on those pages actually changes.
 * Route pages omit lastmod (their price/duration edits are not tracked);
 * blog posts use the real updated_at from the database.
 */
const STATIC_LAST_MODIFIED = new Date("2026-09-12");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/prices`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/private-shuttle`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/faq`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/blog`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/about-contact`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Route pages — only the SEO-worthy subset (see src/lib/destinations.ts),
  // most important first. getRoutes() paginates past the 1,000-row cap that
  // used to silently truncate this list.
  const routePages: MetadataRoute.Sitemap = [];
  try {
    const [routes, destinations] = await Promise.all([
      getRoutes(),
      getDestinations(),
    ]);
    for (const route of selectIndexableRoutes(routes, destinations)) {
      routePages.push({
        url: `${BASE}/private-shuttle/${routeSlug(route.origen, route.destino)}`,
        changeFrequency: "monthly",
        priority: routeSitemapPriority(route, destinations),
      });
    }
  } catch {
    // If DB is unreachable, return static pages only
  }

  // Blog posts from Supabase
  const blogPages: MetadataRoute.Sitemap = [];
  try {
    const { data } = await getSupabase()
      .from("blog_posts_ruta_pacifico")
      .select("slug, updated_at")
      .eq("published", true);

    if (data) {
      for (const post of data) {
        blogPages.push({
          url: `${BASE}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // If DB is unreachable, return static pages only
  }

  return [...staticPages, ...routePages, ...blogPages];
}
