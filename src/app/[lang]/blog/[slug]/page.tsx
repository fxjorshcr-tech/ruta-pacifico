import Image from "next/image";
import Link from "@/components/LocaleLink";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SocialLinks from "@/components/SocialLinks";
import {
  getPostBySlug,
  renderMarkdown,
  formatPostDate,
  type BlogPost,
} from "@/lib/blog";
import { LOGO_WHITE_URL } from "@/lib/brand";
import {
  BASE_URL,
  IN_LANGUAGE,
  OG_LOCALE,
  localeAlternates,
  localeFromParams,
  localeUrl,
  type Locale,
} from "@/lib/i18n";
import { BLOG } from "@/i18n/blog";

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

/** Regenerate at most hourly; edits to a post appear within the hour without a deploy. */
export const revalidate = 3600;

/**
 * No paths at build time: each slug is rendered on its first visit and then
 * served from the ISR cache until `revalidate` elapses. Next only treats a
 * dynamic segment as ISR when this function exists (an empty array is the
 * documented way to say "all paths at runtime").
 */
export function generateStaticParams(): { slug: string }[] {
  return [];
}

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await localeFromParams(params);
  const t = BLOG[locale].post;
  const post = await getPostBySlug(slug, locale);
  if (!post) {
    return {
      title: t.notFoundTitle,
      robots: { index: false, follow: false },
    };
  }
  const canonical = `/blog/${post.slug}`;
  const ogImage = post.cover_image_url ?? HERO_URL;
  return {
    title: `${post.title} | Ruta Pacifico`,
    description: post.excerpt,
    alternates: localeAlternates(canonical, locale),
    keywords: post.tags,
    openGraph: {
      type: "article",
      locale: OG_LOCALE[locale],
      url: localeUrl(locale, canonical),
      title: post.title,
      description: post.excerpt,
      siteName: "Ruta Pacifico",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.cover_image_alt ?? post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

function ArticleJsonLd({ post, locale }: { post: BlogPost; locale: Locale }) {
  const t = BLOG[locale];
  const url = localeUrl(locale, `/blog/${post.slug}`);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.excerpt,
      url,
      inLanguage: IN_LANGUAGE[locale],
      image: post.cover_image_url ?? HERO_URL,
      datePublished: post.published_at ?? undefined,
      dateModified: post.updated_at,
      author: {
        "@type": "Organization",
        name: post.author,
        url: BASE_URL,
      },
      publisher: { "@id": `${BASE_URL}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      keywords: post.tags.join(", "),
      articleSection: post.category,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.breadcrumbHome, item: localeUrl(locale, "/") },
        { "@type": "ListItem", position: 2, name: t.breadcrumbBlog, item: localeUrl(locale, "/blog") },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  if (post.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      url,
      inLanguage: IN_LANGUAGE[locale],
      mainEntity: post.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const locale = await localeFromParams(params);
  const t = BLOG[locale];
  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const html = renderMarkdown(post.content_md);
  const heroImage = post.cover_image_url ?? HERO_URL;

  return (
    <main className="bg-light-surface min-h-screen">
      <ArticleJsonLd post={post} locale={locale} />
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[46vh] items-end overflow-hidden">
        <Image
          src={heroImage}
          alt={post.cover_image_alt ?? post.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-32 pb-12">
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
            <Link href="/blog" className="font-semibold text-sunset-gold hover:underline">
              {t.post.back}
            </Link>
            {post.published_at && <span>· {formatPostDate(post.published_at, locale)}</span>}
            <span>{t.post.updated(formatPostDate(post.updated_at, locale))}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.6rem]">
            {post.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* ─── ARTICLE BODY ─── */}
      <article className="mx-auto max-w-4xl px-6 py-12">
        <div
          className="article-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* ─── FAQ ─── */}
        {post.faqs.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-foreground">
              {t.post.faqHeading}
            </h2>
            <div className="mt-6 space-y-4">
              {post.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[0.95rem] font-bold text-foreground">
                    {f.q}
                    <svg
                      className="h-5 w-5 shrink-0 text-sunset-orange transition-transform group-open:rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ─── CTA ─── */}
        <section className="mt-14">
          <div className="rounded-3xl bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold p-8 text-center text-white shadow-xl sm:p-10">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t.post.cta.heading}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/90 sm:text-base">
              {t.post.cta.body}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/private-shuttle"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-sunset-red shadow-lg transition hover:scale-[1.02]"
              >
                {t.post.cta.seeRoutes}
              </Link>
              <a
                href="https://wa.me/50670805578"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {t.post.cta.whatsapp}
              </a>
            </div>
          </div>
        </section>
      </article>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-black/5 bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <Image
              src={LOGO_WHITE_URL}
              alt="Ruta Pacifico"
              width={240}
              height={100}
              className="h-16 w-auto"
              unoptimized
            />
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
                <Link href="/" className="transition hover:text-sunset-orange">
                  {t.footer.home}
                </Link>
                <Link href="/blog" className="transition hover:text-sunset-orange">
                  {t.footer.blog}
                </Link>
                <Link href="/private-shuttle" className="transition hover:text-sunset-orange">
                  {t.footer.allRoutes}
                </Link>
                <Link href="/faq" className="transition hover:text-sunset-orange">
                  {t.footer.faq}
                </Link>
                <a href="https://wa.me/50670805578" className="transition hover:text-sunset-orange">
                  {t.footer.whatsapp}
                </a>
              </div>
              <SocialLinks />
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/30">
            &copy; {new Date().getFullYear()} Ruta Pacifico. {t.footer.rights}
          </div>
        </div>
      </footer>
    </main>
  );
}
