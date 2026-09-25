import Image from "next/image";
import { isOptimizable } from "@/lib/images";
import Link from "@/components/LocaleLink";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import {
  getPublishedPosts,
  formatPostDate,
  type BlogPostPreview } from "@/lib/blog";
import { LOGO_URL } from "@/lib/brand";
import {
  BASE_URL,
  IN_LANGUAGE,
  OG_LOCALE,
  localeAlternates,
  localeFromParams,
  localeUrl,
  type Locale } from "@/lib/i18n";
import { BLOG } from "@/i18n/blog";

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/playa_tamarindo_kristen_brown.jpg";

/** Regenerate at most hourly; a new post appears within the hour without a deploy. */
export const revalidate = 3600;

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = BLOG[locale].list;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: localeAlternates("/blog", locale),
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: localeUrl(locale, "/blog"),
      title: t.metaTitle,
      description: t.ogDescription,
      siteName: "Ruta Pacifico",
      images: [{ url: HERO_URL, width: 1200, height: 630, alt: t.ogImageAlt }] } };
}

function BlogListJsonLd({ posts, locale }: { posts: BlogPostPreview[]; locale: Locale }) {
  const t = BLOG[locale];
  const pageUrl = localeUrl(locale, "/blog");
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${pageUrl}#blog`,
        url: pageUrl,
        name: t.list.blogName,
        description: t.list.blogDescription,
        inLanguage: IN_LANGUAGE[locale],
        publisher: { "@id": `${BASE_URL}/#organization` },
        blogPost: posts.map((p) => {
          const url = localeUrl(locale, `/blog/${p.slug}`);
          return {
            "@type": "BlogPosting",
            "@id": `${url}#article`,
            headline: p.title,
            url,
            datePublished: p.published_at ?? undefined,
            dateModified: p.updated_at };
        }) },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.breadcrumbHome, item: localeUrl(locale, "/") },
          { "@type": "ListItem", position: 2, name: t.breadcrumbBlog, item: pageUrl },
        ] },
    ] };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sunset-orange/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-sunset-orange">
      {label}
    </span>
  );
}

export default async function BlogIndexPage({ params }: { params: Params }) {
  const locale = await localeFromParams(params);
  const t = BLOG[locale];
  const posts = await getPublishedPosts(locale);

  return (
    <main className="bg-light-surface min-h-screen">
      <BlogListJsonLd posts={posts} locale={locale} />
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[42vh] items-center overflow-hidden">
        <Image
          src={HERO_URL}
          alt={t.list.hero.imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          preload
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-28 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {t.list.hero.eyebrow}
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t.list.hero.titleBefore}{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              {t.list.hero.titleHighlight}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {t.list.hero.intro}
          </p>
        </div>
      </section>

      {/* ─── POSTS GRID ─── */}
      <section className="relative z-20 mx-auto -mt-10 max-w-6xl px-6 pb-20">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-black/5 bg-white p-12 text-center shadow-xl">
            <p className="text-lg font-semibold text-foreground">
              {t.list.empty.title}
            </p>
            <p className="mt-2 text-sm text-foreground/60">
              {t.list.empty.before}{" "}
              <Link href="/faq" className="font-semibold text-sunset-orange hover:underline">
                {t.list.empty.faq}
              </Link>{" "}
              {t.list.empty.or}{" "}
              <Link
                href="/private-shuttle"
                className="font-semibold text-sunset-orange hover:underline"
              >
                {t.list.empty.book}
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-sunset-gold/30 via-sunset-orange/25 to-sunset-red/30">
                  {post.cover_image_url ? (
                    <Image
                      src={post.cover_image_url}
                      alt={post.cover_image_alt ?? post.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      unoptimized={!isOptimizable(post.cover_image_url)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Image
                        src={LOGO_URL}
                        alt="Ruta Pacifico"
                        width={160}
                        height={67}
                        className="h-10 w-auto opacity-70"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <CategoryBadge label={t.categoryLabel(post.category)} />
                    {post.published_at && (
                      <span className="text-xs text-foreground/40">
                        {formatPostDate(post.published_at, locale)}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-lg font-bold leading-snug text-foreground transition group-hover:text-sunset-orange">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground/60">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sunset-orange">
                    {t.list.readMore}
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── CTA ─── */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold p-8 text-center text-white shadow-xl sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {t.list.cta.heading}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/90 sm:text-base">
            {t.list.cta.body}
          </p>
          <Link
            href="/private-shuttle"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-sunset-red shadow-lg transition hover:scale-[1.02]"
          >
            {t.list.cta.button}
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <SiteFooter locale={locale} />
    </main>
  );
}
