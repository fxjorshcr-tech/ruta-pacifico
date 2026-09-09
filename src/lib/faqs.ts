import { cache } from "react";
import { getSupabase } from "@/lib/supabase";
import type { Faq } from "@/components/FaqAccordion";

const COLUMNS = "id, category, question, answer, display_order, is_featured";

/**
 * Up to `limit` general FAQs from faqs_ruta_pacifico: featured ones first,
 * then the lowest-display-order active FAQs so the section always has
 * content even if nothing is flagged as featured. Used on the home page and
 * the booking page (both emit a matching FAQPage JSON-LD).
 */
export const getFeaturedFaqs = cache(async (limit = 6): Promise<Faq[]> => {
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
    const result: Faq[] = (featured ?? []) as Faq[];
    if (result.length >= limit) return result.slice(0, limit);

    const { data: fill } = await getSupabase()
      .from("faqs_ruta_pacifico")
      .select(COLUMNS)
      .eq("is_active", true)
      .eq("is_featured", false)
      .order("display_order", { ascending: true })
      .limit(limit - result.length);
    return [...result, ...((fill ?? []) as Faq[])];
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
