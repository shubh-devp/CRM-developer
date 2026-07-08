import { type Request, type Response } from "express";
import { sendSuccess } from "../utils/response";

export function getHealth(_req: Request, res: Response): void {
  sendSuccess(res, {
    status: "ok" as const,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
