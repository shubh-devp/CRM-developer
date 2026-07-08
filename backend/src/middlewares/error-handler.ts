import { type Request, type Response, type NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";
import { sendError } from "../utils/response";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error("Unhandled error", {
    error: error.message,
    stack: error.stack,
    name: error.name,
  });

  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.code, error.message, error.details);
    return;
  }

  if (error instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const path = issue.path.join(".");
      if (!details[path]) {
        details[path] = [];
      }
      details[path]!.push(issue.message);
    }
    sendError(res, 400, "VALIDATION_ERROR", "Request validation failed", details);
    return;
  }

  if (error.name === "MulterError") {
    sendError(res, 400, "UPLOAD_ERROR", error.message);
    return;
  }

  sendError(res, 500, "INTERNAL_ERROR", "An unexpected error occurred");
}
