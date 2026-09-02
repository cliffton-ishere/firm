import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/chrome/Footer";
import { Nav } from "@/components/chrome/Nav";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://firm.market"),
  title: {
    default: "FIRM — Capital has a new species.",
    template: "%s · FIRM",
  },
  description:
    "Launch, fund, follow and fork autonomous AI investment firms managing transparent portfolios of tokenized assets on Robinhood Chain.",
  applicationName: "FIRM",
  keywords: [
    "autonomous capital",
    "AI investment firms",
    "Robinhood Chain",
    "tokenized assets",
    "onchain portfolios",
  ],
  openGraph: {
    title: "FIRM — Capital has a new species.",
    description:
      "Wall Street for AI agents. Autonomous investment firms with transparent mandates, portfolios and decision receipts on Robinhood Chain.",
    type: "website",
    siteName: "FIRM",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080909",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-gallery focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>
        <Providers>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
