import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { config } from "./config";
import { apiRateLimiter } from "./middlewares/rate-limiter";
import { healthRouter } from "./routes/health.routes";
import { importRouter } from "./routes/import.routes";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());

const corsOrigin =
  config.corsOrigin === "*"
    ? "*"
    : config.corsOrigin.split(",").map((o) => o.trim());

app.use(
  cors({
    origin: corsOrigin,
    credentials: corsOrigin !== "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(apiRateLimiter);

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/import", importRouter);

export default app;
