import type { Metadata } from "next";
import LegalPage, { legalMetadata } from "@/components/LegalPage";
import { localeFromParams } from "@/lib/i18n";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return legalMetadata("refund", await localeFromParams(params));
}

export default async function Page({ params }: { params: Params }) {
  return <LegalPage doc="refund" locale={await localeFromParams(params)} />;
}
