"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { type CsvParseResult, type CsvRow } from "@/types/csv";
import { getErrorMessage } from "@/lib/utils";

interface UseCsvParserReturn {
  parseFile: (_file: File) => void;
  reset: () => void;
  result: CsvParseResult | null;
  isParsing: boolean;
  error: string | null;
}

export function useCsvParser(): UseCsvParserReturn {
  const [result, setResult] = useState<CsvParseResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Only CSV files are supported");
      return;
    }

    setIsParsing(true);
    setError(null);
    setResult(null);

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value?.trim() ?? "",
      complete: (parseResult) => {
        if (parseResult.errors.length > 0) {
          const criticalErrors = parseResult.errors.filter(
            (e) => e.type !== "FieldMismatch"
          );
          if (criticalErrors.length > 0) {
            setError(
              `CSV parsing error: ${criticalErrors[0]?.message ?? "Unknown error"}`
            );
            setIsParsing(false);
            return;
          }
        }

        const rows = parseResult.data.filter((row) =>
          Object.values(row).some((val) => val && val.length > 0)
        );

        setResult({
          headers: parseResult.meta.fields ?? [],
          rows,
          totalRows: rows.length,
          file,
          fileName: file.name,
          fileSize: file.size,
        });
        setIsParsing(false);
      },
      error: (parseError) => {
        setError(getErrorMessage(parseError));
        setIsParsing(false);
      },
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setIsParsing(false);
    setError(null);
  }, []);

  return { parseFile, reset, result, isParsing, error };
}
