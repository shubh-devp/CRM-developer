import { Router } from "express";
import { importCsv } from "../controllers/import.controller";
import { validate } from "../middlewares/validate";
import { importRateLimiter } from "../middlewares/rate-limiter";
import { importRequestSchema } from "../validators/import.validator";

const router = Router();

router.post(
  "/",
  importRateLimiter,
  validate(importRequestSchema, "body"),
  importCsv
);

export { router as importRouter };
