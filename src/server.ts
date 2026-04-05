import { Server } from "http";
import app from "./app.js";
import { env } from "./app/config/env.js";
import redisClient from "./app/config/redis.config.js";
import { StorageService } from "./app/services/storage.service.js";
import logger from "./app/utils/logger.js";

let server: Server;

async function bootstrap() {
  try {
    // 1. Connect to Redis (fast cache)
    await redisClient.connect();
    logger.info("✅ Initialized Redis connection");

    // 2. Connect to Database (robust persistence)
    await StorageService.init();

    // 3. Start Server (Only if NOT on Vercel)
    if (!process.env.VERCEL) {
      server = app.listen(env.PORT || 5000, () => {
        logger.info(
          `🚀 [SERVER] Application is running on port ${env.PORT || 5000}`,
        );
        logger.info(`🌍 Environment: ${env.NODE_ENV}`);
      });
    }
  } catch (err) {
    logger.error(
      err instanceof Error ? err : { err },
      "❌ Failed to bootstrap the server",
    );
    process.exit(1);
  }

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info("⚠️ Server closed");
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    logger.error(
      error instanceof Error ? error : { error },
      "💥 Unexpected Error",
    );
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  process.on("SIGTERM", () => {
    logger.info("🛑 SIGTERM received");
    if (server) {
      server.close();
    }
  });
}

// For local execution
if (!process.env.VERCEL) {
  bootstrap();
}

// For Vercel: Middleware to ensure DB/Redis are connected before any request
app.use(async (_req, _res, next) => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    // StorageService already has internal check to avoid re-init
    await StorageService.init();
    next();
  } catch (err) {
    logger.error(err, "Failed to initialize connections in middleware");
    next(err);
  }
});

export default app;
