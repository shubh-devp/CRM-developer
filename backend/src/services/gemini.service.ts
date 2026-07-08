import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import { config } from "../config";
import { logger } from "../utils/logger";
import { buildMappingPrompt } from "../prompts/csv-mapping.prompt";
import { withRetry } from "../utils/retry";
import { type BatchInput, type BatchResult, type MappedRecord, type SkippedRecord } from "../types/csv.types";
import { type GeminiResponse } from "../types/gemini.types";

let model: GenerativeModel | null = null;

function getModel(): GenerativeModel {
  if (!model) {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });
  }
  return model;
}

function parseGeminiResponse(text: string): GeminiResponse {
  let cleanText = text.trim();

  if (cleanText.startsWith("```json")) {
    cleanText = cleanText.slice(7);
  } else if (cleanText.startsWith("```")) {
    cleanText = cleanText.slice(3);
  }

  if (cleanText.endsWith("```")) {
    cleanText = cleanText.slice(0, -3);
  }

  const parsed = JSON.parse(cleanText.trim()) as GeminiResponse;

  if (!parsed.records || !Array.isArray(parsed.records)) {
    throw new Error("Invalid Gemini response structure: missing records array");
  }

  return parsed;
}

function validateMappedRecord(record: MappedRecord, index: number): SkippedRecord | null {
  const normalizedRecord = record as unknown as Record<string, unknown>;

  const requiredFields = [
    "created_at",
    "name",
    "email",
    "country_code",
    "mobile_without_country_code",
    "company",
    "city",
    "state",
    "country",
    "lead_owner",
    "crm_status",
    "crm_note",
    "data_source",
    "possession_time",
    "description",
  ] as const;

  for (const field of requiredFields) {
    if (normalizedRecord[field] === undefined || normalizedRecord[field] === null) {
      return {
        index,
        reason: `Missing required field: ${field}`,
        originalData: record as unknown as Record<string, string>,
      };
    }
  }

  if (typeof record.email !== "string" || typeof record.mobile_without_country_code !== "string") {
    return {
      index,
      reason: "Email and phone must be strings",
      originalData: record as unknown as Record<string, string>,
    };
  }

  if (!record.email && !record.mobile_without_country_code) {
    return {
      index,
      reason: "Missing both email and phone",
      originalData: record as unknown as Record<string, string>,
    };
  }

  const validStatuses = ["GOOD_LEAD_FOLLOW_UP", "DID_NOT_CONNECT", "BAD_LEAD", "SALE_DONE", ""];
  if (!validStatuses.includes(record.crm_status)) {
    return {
      index,
      reason: `Invalid crm_status: ${record.crm_status}`,
      originalData: record as unknown as Record<string, string>,
    };
  }

  const validSources = [
    "leads_on_demand",
    "meridian_tower",
    "eden_park",
    "varah_swamy",
    "sarjapur_plots",
    "",
  ];
  if (!validSources.includes(record.data_source)) {
    return {
      index,
      reason: `Invalid data_source: ${record.data_source}`,
      originalData: record as unknown as Record<string, string>,
    };
  }

  return null;
}

export async function processBatch(batch: BatchInput): Promise<BatchResult> {
  const prompt = buildMappingPrompt(batch.headers, batch.rows);

  const result = await withRetry(async () => {
    const geminiModel = getModel();
    const response = await geminiModel.generateContent(prompt);
    const text = response.response.text();

    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return parseGeminiResponse(text);
  }, `Batch ${batch.batchIndex}`);

  const validRecords: MappedRecord[] = [];
  const skippedRecords: SkippedRecord[] = [];

  for (let i = 0; i < result.records.length; i++) {
    const record = result.records[i]!;
    const skipResult = validateMappedRecord(record, batch.batchIndex * config.batchSize + i);
    if (skipResult) {
      skippedRecords.push(skipResult);
    } else {
      validRecords.push(record);
    }
  }

  if (result.skipped && result.skipped.length > 0) {
    skippedRecords.push(...result.skipped);
  }

  logger.info(`Batch ${batch.batchIndex} processed`, {
    total: batch.rows.length,
    valid: validRecords.length,
    skipped: skippedRecords.length,
  });

  return {
    batchIndex: batch.batchIndex,
    records: validRecords,
    skipped: skippedRecords,
  };
}
