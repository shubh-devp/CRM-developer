import { type MappedRecord, type SkippedRecord } from "./csv.types";

export interface GeminiRequest {
  headers: string[];
  sampleRows: Record<string, string | undefined>[];
}

export interface GeminiResponse {
  records: MappedRecord[];
  skipped?: SkippedRecord[];
}

export interface GeminiApiError {
  code: number;
  message: string;
  status: string;
}

export function isGeminiApiError(error: unknown): error is GeminiApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}
