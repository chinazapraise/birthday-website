import type { Metadata, Viewport } from "next";
import { Unbounded, Space_Grotesk, Caveat } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "27: The Story So Far",
  description:
    "2016-2026. Eleven years. A lot happened before we got here. Tomide's story, year by year, and you're part of what happens next.",
  openGraph: {
    title: "27: The Story So Far",
    description: "2016-2026. A lot happened before we got here.",
    type: "website",
    siteName: "TOMIDE / 27",
  },
  twitter: {
    card: "summary_large_image",
    title: "27: The Story So Far",
    description: "Eleven years. A lot happened before we got here.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#07060b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${unbounded.variable} ${spaceGrotesk.variable} ${caveat.variable}`}
    >
      <body className="grain bg-ink text-cream antialiased">{children}</body>
    </html>
  );
}