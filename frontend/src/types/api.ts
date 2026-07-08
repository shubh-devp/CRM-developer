export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

import { type CsvRow } from "./csv";

export interface ImportPayload {
  headers: string[];
  rows: CsvRow[];
  fileName: string;
}

export interface HealthResponse {
  status: "ok" | "error";
  timestamp: string;
  version: string;
}
