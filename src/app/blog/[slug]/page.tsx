import Image from "next/image";
import Link from "next/link";
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

const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";
const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

export const dynamic = "force-dynamic";

const BASE = "https://rutapacifico.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: "Article not found | Ruta Pacifico",
      robots: { index: false, follow: false },
    };
  }
  const canonical = `/blog/${post.slug}`;
  const ogImage = post.cover_image_url ?? HERO_URL;
  return {
    title: `${post.title} | Ruta Pacifico`,
    description: post.excerpt,
    alternates: { canonical },
    keywords: post.tags,
    openGraph: {
      type: "article",
      url: `${BASE}${canonical}`,
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

function ArticleJsonLd({ post }: { post: BlogPost }) {
  const url = `${BASE}/blog/${post.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.excerpt,
      url,
      inLanguage: "en-US",
      image: post.cover_image_url ?? HERO_URL,
      datePublished: post.published_at ?? undefined,
      dateModified: post.updated_at,
      author: {
        "@type": "Organization",
        name: post.author,
        url: BASE,
      },
      publisher: { "@id": `${BASE}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      keywords: post.tags.join(", "),
      articleSection: post.category,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  if (post.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      url,
      inLanguage: "en-US",
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.content_md);
  const heroImage = post.cover_image_url ?? HERO_URL;

  return (
    <main className="bg-light-surface min-h-screen">
      <ArticleJsonLd post={post} />
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
              ← All guides
            </Link>
            {post.published_at && <span>· {formatPostDate(post.published_at)}</span>}
            <span>· Updated {formatPostDate(post.updated_at)}</span>
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
              Frequently asked questions
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
              Book your private shuttle
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/90 sm:text-base">
              Fixed prices, bilingual drivers, flight tracking and free child
              seats — anywhere in Costa Rica, door to door.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/private-shuttle"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-sunset-red shadow-lg transition hover:scale-[1.02]"
              >
                See routes &amp; prices
              </Link>
              <a
                href="https://wa.me/50670805578"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                💬 WhatsApp us
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
              src={LOGO_URL}
              alt="Ruta Pacifico"
              width={200}
              height={65}
              className="h-16 w-auto"
              unoptimized
            />
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
                <Link href="/" className="transition hover:text-sunset-orange">
                  Home
                </Link>
                <Link href="/blog" className="transition hover:text-sunset-orange">
                  Blog
                </Link>
                <Link href="/private-shuttle" className="transition hover:text-sunset-orange">
                  All routes
                </Link>
                <Link href="/faq" className="transition hover:text-sunset-orange">
                  FAQ
                </Link>
                <a href="https://wa.me/50670805578" className="transition hover:text-sunset-orange">
                  WhatsApp
                </a>
              </div>
              <SocialLinks />
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/30">
            &copy; 2025 Ruta Pacifico. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
