"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Upload,
  Table2,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Mapping",
    description:
      "Gemini AI automatically maps any CSV column to your CRM schema — no manual configuration needed.",
  },
  {
    icon: Upload,
    title: "Drag & Drop Upload",
    description:
      "Upload CSVs with drag-and-drop or click-to-browse. Preview data instantly before importing.",
  },
  {
    icon: Table2,
    title: "Smart Preview",
    description:
      "See your data in a virtualized table with search, pagination, and horizontal scrolling.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Get comprehensive import stats: imported records, skipped entries, accuracy, and processing time.",
  },
  {
    icon: Shield,
    title: "Validation & Safety",
    description:
      "Zod validation on both client and server. Skip records gracefully without data loss.",
  },
  {
    icon: Zap,
    title: "Batch Processing",
    description:
      "Process thousands of records in parallel batches with automatic retry on failure.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function Features() {
  return (
    <section id="features" className="border-t border-border/50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for CSV import
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built for scale. Designed for simplicity.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="glass-card h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
