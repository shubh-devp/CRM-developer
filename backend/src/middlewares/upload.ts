import multer from "multer";
import path from "path";
import { config } from "../config";
import { AppError } from "./error-handler";

const ALLOWED_MIMES = [
  "text/csv",
  "application/vnd.ms-excel",
  "text/plain",
  "application/octet-stream",
];

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSizeMb * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext !== ".csv") {
      cb(new AppError(400, "INVALID_FILE_TYPE", "Only CSV files are allowed"));
      return;
    }

    if (!ALLOWED_MIMES.includes(file.mimetype) && file.mimetype !== "text/csv") {
      cb(new AppError(400, "INVALID_FILE_TYPE", "Only CSV files are allowed"));
      return;
    }

    cb(null, true);
  },
});
