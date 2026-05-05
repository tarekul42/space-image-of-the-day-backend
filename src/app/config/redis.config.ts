import { createClient } from "redis";
import logger from "../utils/logger";
import { env } from "./env";

const redisClient = createClient({
  url: env.REDIS_URL,
  pingInterval: 50000, // Keep connection alive (useful for managed/free-tier Redis)
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error("Redis reconnection failed after 10 attempts");
        return new Error("Retry limit reached");
      }
      return Math.min(retries * 50, 2000); // Exponential backoff
    },
  },
});

// Event Listeners
redisClient.on("error", (err) => logger.error({ err }, "Redis Client Error"));
redisClient.on("connect", () =>
  logger.info("🚀 Redis: Connection established"),
);
redisClient.on("ready", () => logger.info("✅ Redis: Client ready to use"));
redisClient.on("reconnecting", () =>
  logger.warn("🔄 Redis: Attempting to reconnect..."),
);

export default redisClient;
