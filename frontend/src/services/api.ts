import { type ApiResponse, type ImportPayload } from "@/types/api";
import { type ImportResult } from "@/types/csv";

const API_URL =
  typeof window !== "undefined" && window.location.origin.includes("localhost")
    ? process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:5000"
    : "";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const json = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !json.success) {
      const errorMessage =
        json.error?.message ?? `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.name = "ApiError";
      throw error;
    }

    return json.data as T;
  }

  async importCsv(payload: ImportPayload): Promise<ImportResult> {
    return this.request<ImportResult>("/api/v1/import", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    return this.request("/api/v1/health");
  }
}

export const apiClient = new ApiClient(API_URL);
