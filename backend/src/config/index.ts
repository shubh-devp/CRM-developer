import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface Config {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  geminiApiKey: string;
  maxFileSizeMb: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  logLevel: string;
  batchSize: number;
  maxRetries: number;
  retryDelayMs: number;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config: Config = {
  port: parseInt(getEnvVar("PORT", "5000"), 10),
  nodeEnv: getEnvVar("NODE_ENV", "development"),
  corsOrigin: getEnvVar("CORS_ORIGIN", "http://localhost:3000"),
  geminiApiKey: getEnvVar("GEMINI_API_KEY"),
  maxFileSizeMb: parseInt(getEnvVar("MAX_FILE_SIZE_MB", "10"), 10),
  rateLimitWindowMs: parseInt(getEnvVar("RATE_LIMIT_WINDOW_MS", "900000"), 10),
  rateLimitMaxRequests: parseInt(getEnvVar("RATE_LIMIT_MAX_REQUESTS", "100"), 10),
  logLevel: getEnvVar("LOG_LEVEL", "debug"),
  batchSize: 20,
  maxRetries: 3,
  retryDelayMs: 1000,
};
