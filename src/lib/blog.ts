import { marked } from "marked";
import { getSupabase } from "@/lib/supabase";

export interface BlogFaq {
  q: string;
  a: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_md: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  category: string;
  tags: string[];
  faqs: BlogFaq[];
  author: string;
  published_at: string | null;
  updated_at: string;
}

const LIST_COLUMNS =
  "id, slug, title, excerpt, cover_image_url, cover_image_alt, category, tags, published_at, updated_at";

export type BlogPostPreview = Omit<BlogPost, "content_md" | "faqs" | "author">;

export async function getPublishedPosts(): Promise<BlogPostPreview[]> {
  const { data, error } = await getSupabase()
    .from("blog_posts_ruta_pacifico")
    .select(LIST_COLUMNS)
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch blog posts:", error.message);
    return [];
  }
  return (data ?? []) as BlogPostPreview[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await getSupabase()
    .from("blog_posts_ruta_pacifico")
    .select("*")
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Failed to fetch blog post "${slug}":`, error.message);
    return null;
  }
  return (data as BlogPost) ?? null;
}

/**
 * Render trusted Markdown (authored by us, stored in Supabase behind RLS)
 * to HTML. GFM is on so pipe tables — heavily used in these articles and
 * heavily quoted by AI crawlers — work.
 */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { gfm: true, async: false });
}

export function formatPostDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
