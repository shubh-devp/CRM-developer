import type { Metadata } from "next";
import { Inter, Calistoga } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const calistoga = Calistoga({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-calistoga",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CSV Importer — AI-Powered CRM Import",
    template: "%s | CSV Importer",
  },
  description:
    "Import any CRM CSV into GrowEasy with AI-powered intelligent field mapping. Supports Facebook, Google Ads, HubSpot, and more.",
  keywords: [
    "CSV import",
    "CRM import",
    "AI mapping",
    "GrowEasy",
    "data import",
    "csv parser",
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${calistoga.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
