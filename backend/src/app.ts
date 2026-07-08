import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { config } from "./config";
import { logger } from "./utils/logger";
import { errorHandler } from "./middlewares/error-handler";
import { apiRateLimiter } from "./middlewares/rate-limiter";
import { healthRouter } from "./routes/health.routes";
import { importRouter } from "./routes/import.routes";

const app = express();

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(apiRateLimiter);

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/import", importRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "The requested resource was not found",
    },
  });
});

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Server started`, {
    port: config.port,
    env: config.nodeEnv,
    corsOrigin: config.corsOrigin,
  });
});

export default app;
