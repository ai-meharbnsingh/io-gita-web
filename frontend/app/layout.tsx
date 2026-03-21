import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "io-gita — See Your Inner Forces",
  description:
    "Not an AI that predicts your future. A mirror built on physics that shows you where you're torn and why.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
