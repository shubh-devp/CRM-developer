"use client";

import { motion } from "framer-motion";
import { Upload, ScanEye, WandSparkles, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload CSV",
    description: "Drop your CSV file or click to browse. We accept any CRM export format.",
    step: "01",
  },
  {
    icon: ScanEye,
    title: "Preview Data",
    description: "Review your data in a beautiful table with search and pagination.",
    step: "02",
  },
  {
    icon: WandSparkles,
    title: "AI Maps Fields",
    description: "Gemini AI intelligently maps columns to your CRM schema automatically.",
    step: "03",
  },
  {
    icon: BarChart3,
    title: "Review Results",
    description: "See exactly what was imported, skipped, and why — with detailed stats.",
    step: "04",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four simple steps to import your CRM data.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-primary via-primary/50 to-transparent md:block" />

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15 }}
                className="relative md:ml-20 md:pb-16"
              >
                <div className="absolute -left-4 hidden h-8 w-8 items-center justify-center rounded-full border bg-background md:flex">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="flex gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 md:hidden">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="hidden items-center gap-3 md:flex">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-primary">
                        Step {step.step}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-semibold md:mt-3">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
