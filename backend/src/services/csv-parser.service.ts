import Papa from "papaparse";
import { type CsvParseResult, type CsvRow } from "../types/csv.types";

export interface ParseConfig {
  headers: string[];
  rows: CsvRow[];
}

export function parseCsvFromBuffer(buffer: Buffer): CsvParseResult {
  const content = buffer.toString("utf-8");

  const result = Papa.parse<CsvRow>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value?.trim() ?? "",
  });

  if (result.errors.length > 0) {
    const parseErrors = result.errors.filter((e) => e.type !== "FieldMismatch");
    if (parseErrors.length > 0) {
      throw new Error(`CSV parsing error: ${parseErrors[0]?.message ?? "Unknown error"}`);
    }
  }

  const rows = result.data.filter((row) =>
    Object.values(row).some((val) => val && val.length > 0)
  );

  return {
    headers: result.meta.fields ?? [],
    rows,
    totalRows: rows.length,
  };
}

export function validateCsvHeaders(headers: string[]): string[] {
  const errors: string[] = [];

  if (headers.length === 0) {
    errors.push("CSV has no headers");
  }

  const uniqueHeaders = new Set(headers.map((h) => h.toLowerCase()));
  if (uniqueHeaders.size !== headers.length) {
    errors.push("CSV contains duplicate headers");
  }

  return errors;
}
