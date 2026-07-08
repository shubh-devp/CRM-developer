import { type Request, type Response } from "express";
import { importCsvData } from "../services/import.service";
import { sendSuccess } from "../utils/response";
import { type ImportRequest } from "../validators/import.validator";

export async function importCsv(req: Request, res: Response): Promise<void> {
  const { headers, rows } = req.body as ImportRequest;

  const result = await importCsvData(headers, rows);

  sendSuccess(res, result);
}
