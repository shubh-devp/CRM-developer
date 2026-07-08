"use client";

import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Cta } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Cta />
      <footer className="border-t border-border/50 px-4 py-8 text-center text-sm text-muted-foreground">
        <p>Powered by GrowEasy AI</p>
      </footer>
    </main>
  );
}
