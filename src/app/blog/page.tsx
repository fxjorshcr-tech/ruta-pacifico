import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import {
  getPublishedPosts,
  formatPostDate,
  type BlogPostPreview,
} from "@/lib/blog";

const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";
const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/playa_tamarindo_kristen_brown.jpg";

export const dynamic = "force-dynamic";

const BASE = "https://rutapacifico.com";

export const metadata: Metadata = {
  title: "Guanacaste Travel Guide & Blog | Ruta Pacifico",
  description:
    "Local travel guides for Guanacaste, Costa Rica: getting around from Liberia Airport (LIR), beach town comparisons, driving times, weather and trip planning — written by the team that drives these roads every day.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${BASE}/blog`,
    title: "Guanacaste Travel Guide & Blog | Ruta Pacifico",
    description:
      "Local travel guides for Guanacaste, Costa Rica — airport transfers, beach towns, driving times and trip planning.",
    siteName: "Ruta Pacifico",
    images: [{ url: HERO_URL, width: 1200, height: 630, alt: "Guanacaste, Costa Rica" }],
  },
};

function BlogListJsonLd({ posts }: { posts: BlogPostPreview[] }) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${BASE}/blog#blog`,
        url: `${BASE}/blog`,
        name: "Ruta Pacifico — Guanacaste Travel Guide",
        description:
          "Local travel guides for Guanacaste, Costa Rica, written by a licensed ground-transportation operator based in Liberia.",
        inLanguage: "en-US",
        publisher: { "@id": `${BASE}/#organization` },
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          "@id": `${BASE}/blog/${p.slug}#article`,
          headline: p.title,
          url: `${BASE}/blog/${p.slug}`,
          datePublished: p.published_at ?? undefined,
          dateModified: p.updated_at,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE}/blog#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

function CategoryBadge({ category }: { category: string }) {
  const label = category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return (
    <span className="inline-flex items-center rounded-full bg-sunset-orange/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-sunset-orange">
      {label}
    </span>
  );
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="bg-light-surface min-h-screen">
      <BlogListJsonLd posts={posts} />
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[42vh] items-center overflow-hidden">
        <Image
          src={HERO_URL}
          alt="Guanacaste, Costa Rica"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-28 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Local knowledge · Written in Guanacaste
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Guanacaste{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              Travel Guide
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            Honest, up-to-date answers about getting around Costa Rica&rsquo;s
            Gold Coast — from the team that drives these roads every single day.
          </p>
        </div>
      </section>

      {/* ─── POSTS GRID ─── */}
      <section className="relative z-20 mx-auto -mt-10 max-w-6xl px-6 pb-20">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-black/5 bg-white p-12 text-center shadow-xl">
            <p className="text-lg font-semibold text-foreground">
              New guides are on the way.
            </p>
            <p className="mt-2 text-sm text-foreground/60">
              Meanwhile, check our{" "}
              <Link href="/faq" className="font-semibold text-sunset-orange hover:underline">
                FAQ
              </Link>{" "}
              or{" "}
              <Link
                href="/private-shuttle"
                className="font-semibold text-sunset-orange hover:underline"
              >
                book a private shuttle
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
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Image
                        src={LOGO_URL}
                        alt="Ruta Pacifico"
                        width={160}
                        height={53}
                        className="h-10 w-auto opacity-70"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <CategoryBadge category={post.category} />
                    {post.published_at && (
                      <span className="text-xs text-foreground/40">
                        {formatPostDate(post.published_at)}
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
                    Read the guide
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
            Ready to skip the rental-car hassle?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/90 sm:text-base">
            Fixed-price private shuttles anywhere in Costa Rica — bilingual
            drivers, flight tracking, free child seats.
          </p>
          <Link
            href="/private-shuttle"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-sunset-red shadow-lg transition hover:scale-[1.02]"
          >
            See routes &amp; prices
          </Link>
        </div>
      </section>

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
            <div className="flex items-center gap-6 text-sm text-white/50">
              <Link href="/" className="transition hover:text-sunset-orange">
                Home
              </Link>
              <Link href="/private-shuttle" className="transition hover:text-sunset-orange">
                All routes
              </Link>
              <Link href="/faq" className="transition hover:text-sunset-orange">
                FAQ
              </Link>
              <a href="https://wa.me/50685962438" className="transition hover:text-sunset-orange">
                WhatsApp
              </a>
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
