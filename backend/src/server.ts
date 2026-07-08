import app from "./app";
import { config } from "./config";
import { logger } from "./utils/logger";
import { errorHandler } from "./middlewares/error-handler";

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
