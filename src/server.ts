import { Server } from "http";
import app from "./app";
import { env } from "./app/config/env";
import { StorageService } from "./app/services/storage.service";
import logger from "./app/utils/logger";

let server: Server;

async function bootstrap() {
  try {
    // Unify all storage initialization (Redis + Mongo)
    await StorageService.init();

    if (!process.env.VERCEL) {
      server = app.listen(env.PORT || 5000, () => {
        logger.info({ port: env.PORT || 5000, env: env.NODE_ENV }, "🚀 [SERVER] Application running");
      });
    }
  } catch (err) {
    logger.error({ err }, "❌ Failed to bootstrap the server");
    process.exit(1);
  }
}

// Global process handlers
const exitHandler = () => {
  if (server) server.close(() => logger.info("⚠️ Server closed"));
  process.exit(1);
};

process.on("uncaughtException", (err) => {
  logger.error({ err }, "💥 Uncaught Exception");
  exitHandler();
});
process.on("unhandledRejection", (err) => {
  logger.error({ err }, "💥 Unhandled Rejection");
  exitHandler();
});
process.on("SIGTERM", () => server?.close(() => logger.info("🛑 SIGTERM received")));

// Start for local, or use middleware for Vercel
if (!process.env.VERCEL) {
  bootstrap();
}

app.use(async (_req, _res, next) => {
  try {
    await StorageService.init();
    next();
  } catch (err) {
    next(err);
  }
});

export default app;
