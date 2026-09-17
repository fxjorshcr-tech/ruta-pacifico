import { marked } from "marked";
import { getSupabase } from "@/lib/supabase";
import { withCurrentContact, withCurrentContactIn } from "@/lib/contact";
import { INTL_LOCALE, pickLocale, type Locale } from "@/lib/i18n";

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

/**
 * Spanish twins of the authored fields (supabase/i18n_es_schema.sql). Rows
 * are read with `*` so the columns are optional until the migration runs.
 */
type SpanishFields = {
  title_es?: string | null;
  excerpt_es?: string | null;
  content_md_es?: string | null;
  faqs_es?: BlogFaq[] | null;
  cover_image_alt_es?: string | null;
};

const LIST_COLUMNS = "*";

export type BlogPostPreview = Omit<BlogPost, "content_md" | "faqs" | "author">;

function localizePreview<T extends BlogPostPreview & SpanishFields>(row: T, locale: Locale): T {
  return {
    ...row,
    title: pickLocale(locale, row.title_es, row.title),
    excerpt: pickLocale(locale, row.excerpt_es, row.excerpt),
    cover_image_alt: pickLocale(locale, row.cover_image_alt_es, row.cover_image_alt),
  };
}

export async function getPublishedPosts(locale: Locale = "en"): Promise<BlogPostPreview[]> {
  const { data, error } = await getSupabase()
    .from("blog_posts_ruta_pacifico")
    .select(LIST_COLUMNS)
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch blog posts:", error.message);
    return [];
  }
  return (data ?? []).map((row) =>
    withCurrentContactIn(localizePreview(row as BlogPostPreview & SpanishFields, locale), ["title", "excerpt"])
  );
}

export async function getPostBySlug(slug: string, locale: Locale = "en"): Promise<BlogPost | null> {
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
  if (!data) return null;
  const row = data as BlogPost & SpanishFields;
  const localized: BlogPost = {
    ...localizePreview(row, locale),
    content_md: pickLocale(locale, row.content_md_es, row.content_md),
    faqs: pickLocale(locale, row.faqs_es, row.faqs),
  };
  const post = withCurrentContactIn(localized, ["title", "excerpt", "content_md"]);
  post.faqs = (post.faqs ?? []).map((f) => ({
    q: withCurrentContact(f.q),
    a: withCurrentContact(f.a),
  }));
  return post;
}

/**
 * Render trusted Markdown (authored by us, stored in Supabase behind RLS)
 * to HTML. GFM is on so pipe tables — heavily used in these articles and
 * heavily quoted by AI crawlers — work.
 */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { gfm: true, async: false });
}

export function formatPostDate(iso: string | null, locale: Locale = "en"): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(INTL_LOCALE[locale], {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
