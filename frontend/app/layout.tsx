import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const siteUrl = "https://io-gita.vercel.app";

export const metadata: Metadata = {
  title: "io-gita — See Your Inner Forces",
  description:
    "Not an AI that predicts your future. A mirror built on the Bhagavad Gita and physics that shows you where you're torn and why. 11 questions, 3 minutes, completely free.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "io-gita — See Your Inner Forces",
    description:
      "A mirror built on the Bhagavad Gita and physics. 11 questions reveal the forces inside you — the ones pushing, pulling, and the ones you didn't know were there.",
    url: siteUrl,
    siteName: "io-gita",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/wax-seal.png`,
        width: 682,
        height: 682,
        alt: "io-gita — Ancient Text, Modern Physics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "io-gita — See Your Inner Forces",
    description:
      "11 questions. 3 minutes. A mirror built on the Bhagavad Gita that shows you where you're torn and why.",
    images: [`${siteUrl}/wax-seal.png`],
  },
  keywords: [
    "Bhagavad Gita",
    "inner forces",
    "self discovery",
    "consciousness",
    "Gita quiz",
    "self awareness",
    "guna",
    "sattva rajas tamas",
    "personality mirror",
    "io-gita",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@300;400;500;600&family=IM+Fell+English:ital@0;1&family=Laila:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "io-gita",
              url: siteUrl,
              description:
                "A mirror built on the Bhagavad Gita and physics that shows you where you're torn and why.",
              applicationCategory: "Self-Discovery",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Person",
                name: "Meharban Singh",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
