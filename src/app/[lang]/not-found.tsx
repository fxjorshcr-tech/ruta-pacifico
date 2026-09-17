import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found · Página no encontrada",
  description:
    "That page does not exist on Ruta Pacifico. Search every private shuttle route from Liberia Airport (LIR) and across Costa Rica.",
  robots: { index: false, follow: true },
  // Override the root layout's canonical ("/") — a 404 must not claim to be
  // the home page.
  alternates: {},
};

export default function NotFound() {
  return (
    <main className="bg-light-surface min-h-screen">
      <SiteNav transparent={false} />
      <NotFoundContent />
    </main>
  );
}
