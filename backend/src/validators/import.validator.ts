import { z } from "zod";

export const importRequestSchema = z.object({
  headers: z
    .array(z.string())
    .min(1, "At least one header is required")
    .max(200, "Too many columns"),
  rows: z
    .array(z.record(z.string(), z.string().optional()))
    .min(1, "At least one row is required")
    .max(10000, "Too many rows"),
  fileName: z
    .string()
    .min(1, "File name is required")
    .max(255, "File name too long")
    .refine((val) => val.endsWith(".csv"), {
      message: "File must be a CSV",
    }),
});

export type ImportRequest = z.infer<typeof importRequestSchema>;
