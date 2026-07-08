import { type CsvRow, type MappedRecord, type SkippedRecord, type ProcessingStats } from "../types/csv.types";
import { config } from "../config";
import { processBatch } from "./gemini.service";
import { logger } from "../utils/logger";

export interface ImportResult {
  success: MappedRecord[];
  skipped: SkippedRecord[];
  stats: ProcessingStats;
}

export async function importCsvData(
  headers: string[],
  rows: CsvRow[]
): Promise<ImportResult> {
  const startTime = Date.now();
  const allSuccess: MappedRecord[] = [];
  const allSkipped: SkippedRecord[] = [];

  const batches = createBatches(headers, rows, config.batchSize);
  logger.info(`Processing ${rows.length} records in ${batches.length} batches`);

  const batchResults = await Promise.allSettled(
    batches.map((batch) => processBatch(batch))
  );

  for (const result of batchResults) {
    if (result.status === "fulfilled") {
      allSuccess.push(...result.value.records);
      allSkipped.push(...result.value.skipped);
    } else {
      logger.error("Batch processing failed", {
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      });
    }
  }

  const processingTimeMs = Date.now() - startTime;
  const totalProcessed = allSuccess.length + allSkipped.length;
  const accuracy = totalProcessed > 0
    ? Math.round((allSuccess.length / totalProcessed) * 10000) / 100
    : 0;

  logger.info(`Import completed`, {
    total: rows.length,
    imported: allSuccess.length,
    skipped: allSkipped.length,
    accuracy: `${accuracy}%`,
    processingTimeMs,
  });

  return {
    success: allSuccess,
    skipped: allSkipped,
    stats: {
      total: rows.length,
      imported: allSuccess.length,
      skipped: allSkipped.length,
      accuracy,
      processingTimeMs,
    },
  };
}

interface BatchData {
  headers: string[];
  rows: CsvRow[];
  batchIndex: number;
}

function createBatches(
  headers: string[],
  rows: CsvRow[],
  batchSize: number
): BatchData[] {
  const batches: BatchData[] = [];

  for (let i = 0; i < rows.length; i += batchSize) {
    const batchRows = rows.slice(i, i + batchSize);
    batches.push({
      headers,
      rows: batchRows,
      batchIndex: batches.length,
    });
  }

  return batches;
}
