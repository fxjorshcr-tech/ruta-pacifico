import { cache } from "react";
import { getSupabase } from "@/lib/supabase";
import type { Faq } from "@/components/FaqAccordion";
import { withCurrentContactIn } from "@/lib/contact";
import { pickLocale, type Locale } from "@/lib/i18n";

/**
 * `*` rather than a column list so the optional Spanish columns
 * (question_es, answer_es — see supabase/i18n_es_schema.sql) are picked up
 * when present and silently absent before the migration runs.
 */
const COLUMNS = "*";

type FaqRow = Faq & { question_es?: string | null; answer_es?: string | null };

/** Rows straight from the table, in the requested language, with contact details brought up to date. */
export function normalise(row: unknown, locale: Locale = "en"): Faq {
  const r = row as FaqRow;
  const faq: Faq = {
    id: r.id,
    category: r.category,
    question: pickLocale(locale, r.question_es, r.question),
    answer: pickLocale(locale, r.answer_es, r.answer),
  };
  return withCurrentContactIn(faq, ["question", "answer"]);
}

/**
 * Up to `limit` general FAQs from faqs_ruta_pacifico: featured ones first,
 * then the lowest-display-order active FAQs so the section always has
 * content even if nothing is flagged as featured. Used on the home page and
 * the booking page (both emit a matching FAQPage JSON-LD).
 */
export const getFeaturedFaqs = cache(async (limit = 6, locale: Locale = "en"): Promise<Faq[]> => {
  try {
    const { data: featured, error: featuredError } = await getSupabase()
      .from("faqs_ruta_pacifico")
      .select(COLUMNS)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("display_order", { ascending: true })
      .limit(limit);
    if (featuredError) {
      console.error("Failed to fetch featured FAQs:", featuredError.message);
      return [];
    }
    const result: Faq[] = (featured ?? []).map((row) => normalise(row, locale));
    if (result.length >= limit) return result.slice(0, limit);

    const { data: fill } = await getSupabase()
      .from("faqs_ruta_pacifico")
      .select(COLUMNS)
      .eq("is_active", true)
      .eq("is_featured", false)
      .order("display_order", { ascending: true })
      .limit(limit - result.length);
    return [...result, ...(fill ?? []).map((row) => normalise(row, locale))];
  } catch (err) {
    console.error("Failed to fetch FAQs:", err);
    return [];
  }
});

/** schema.org FAQPage node for a list of FAQs. */
export function faqPageJsonLd(
  id: string,
  faqs: { question: string; answer: string }[]
) {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
