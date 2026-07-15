import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "JAWNAH — Gloss haute brillance", template: "%s · JAWNAH" },
  description: "Des gloss lumineux, confortables et irrésistibles conçus pour faire briller chaque sourire.",
  openGraph: {
    title: "JAWNAH — Révélez l’éclat de vos lèvres",
    description: "Gloss premium, brillance miroir et confort longue durée.",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og.png", width: 1733, height: 909, alt: "Collection de gloss JAWNAH" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
