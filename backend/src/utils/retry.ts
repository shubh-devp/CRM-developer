import { logger } from "./logger";
import { config } from "../config";

export async function withRetry<T>(
  fn: () => Promise<T>,
  context: string,
  maxRetries = config.maxRetries,
  delayMs = config.retryDelayMs
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn(`Retry attempt ${attempt}/${maxRetries} failed for ${context}`, {
        error: lastError.message,
        attempt,
      });

      if (attempt < maxRetries) {
        const backoffDelay = delayMs * Math.pow(2, attempt - 1);
        await sleep(backoffDelay);
      }
    }
  }

  throw lastError ?? new Error(`Operation ${context} failed after ${maxRetries} retries`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
