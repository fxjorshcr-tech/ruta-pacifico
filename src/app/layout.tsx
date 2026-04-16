import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruta Pacifico | Private Shuttles from Liberia Airport (LIR)",
  description:
    "Private airport shuttles from Liberia Airport (LIR) to Tamarindo, Flamingo, Papagayo, Nosara and every beach on Costa Rica's Golden Coast. Fixed prices, bilingual drivers, flight tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
