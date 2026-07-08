"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/services/api";
import { type ImportResult, type CsvRow } from "@/types/csv";
import { getErrorMessage } from "@/lib/utils";

interface UseCsvImportReturn {
  importData: (_headers: string[], _rows: CsvRow[], _fileName: string) => Promise<void>;
  reset: () => void;
  result: ImportResult | null;
  isImporting: boolean;
  progress: number;
  error: string | null;
}

export function useCsvImport(): UseCsvImportReturn {
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const importData = useCallback(
    async (headers: string[], rows: CsvRow[], fileName: string) => {
      setIsImporting(true);
      setError(null);
      setProgress(0);
      setResult(null);

      try {
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 500);

        const importResult = await apiClient.importCsv({
          headers,
          rows,
          fileName,
        });

        clearInterval(progressInterval);
        setProgress(100);
        setResult(importResult);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsImporting(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setIsImporting(false);
    setProgress(0);
    setError(null);
  }, []);

  return { importData, reset, result, isImporting, progress, error };
}
