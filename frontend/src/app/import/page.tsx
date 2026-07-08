"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Database } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CsvUploader } from "@/components/upload/csv-uploader";
import { CsvTable } from "@/components/preview/csv-table";
import { ResultDashboard } from "@/components/results/result-dashboard";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useCsvParser } from "@/hooks/use-csv-parser";
import { useCsvImport } from "@/hooks/use-csv-import";
import { formatBytes } from "@/lib/utils";

type ImportStep = "upload" | "preview" | "importing" | "results";

export default function ImportPage() {
  const [step, setStep] = useState<ImportStep>("upload");
  const {
    result: parseResult,
    isParsing,
    error: parseError,
    parseFile,
    reset: resetParser,
  } = useCsvParser();
  const {
    importData,
    result: importResult,
    isImporting: _isImporting,
    progress,
    error: importError,
    reset: resetImport,
  } = useCsvImport();

  const handleFileSelect = useCallback(
    (file: File) => {
      resetImport();
      parseFile(file);
      setStep("preview");
    },
    [parseFile, resetImport]
  );

  const handleImport = useCallback(async () => {
    if (!parseResult) return;
    setStep("importing");
    await importData(
      parseResult.headers,
      parseResult.rows,
      parseResult.fileName
    );
    setStep("results");
  }, [parseResult, importData]);

  const handleReset = useCallback(() => {
    resetParser();
    resetImport();
    setStep("upload");
  }, [resetParser, resetImport]);

  return (
    <main className="min-h-screen">
      <nav className="glass fixed inset-x-0 top-0 z-50 border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Database className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                CSV Importer
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-2xl py-12"
            >
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                  Import CSV
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Upload your CRM CSV file. We&apos;ll map it automatically.
                </p>
              </div>
              <CsvUploader
                onFileSelect={handleFileSelect}
                isParsing={isParsing}
                error={parseError}
              />
            </motion.div>
          )}

          {step === "preview" && parseResult && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-8"
            >
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      Preview Data
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                      {parseResult.fileName} &middot;{" "}
                      {formatBytes(parseResult.fileSize)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleReset}>
                      Change File
                    </Button>
                    <Button onClick={handleImport} size="lg">
                      Import {parseResult.totalRows.toLocaleString()} Records
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="mb-8" />

              <CsvTable
                headers={parseResult.headers}
                rows={parseResult.rows}
                totalRows={parseResult.totalRows}
              />
            </motion.div>
          )}

          {step === "importing" && (
            <motion.div
              key="importing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-lg py-24 text-center"
            >
              <div className="mb-8">
                <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <h2 className="text-2xl font-bold tracking-tight">
                  Importing Your Data
                </h2>
                <p className="mt-2 text-muted-foreground">
                  AI is mapping {parseResult?.totalRows.toLocaleString() ?? 0}{" "}
                  records to your CRM schema
                </p>
              </div>

              <div className="mx-auto max-w-sm space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">{progress}%</p>
              </div>

              {importError && (
                <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 px-6 py-4 text-sm text-destructive">
                  {importError}
                </div>
              )}
            </motion.div>
          )}

          {step === "results" && importResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-8"
            >
              <ResultDashboard result={importResult} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
