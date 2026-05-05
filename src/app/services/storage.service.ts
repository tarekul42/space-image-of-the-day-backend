import { connectMongo, getDb } from "../config/mongo.config";
import redisClient from "../config/redis.config";
import { IApodData } from "../modules/apod/apod.interface";
import logger from "../utils/logger";

/**
 * Unified Storage Service
 */
export const StorageService = {
  async get(key: string): Promise<IApodData | null> {
    try {
      const cached = await redisClient.get(key);
      if (cached) return JSON.parse(cached);

      const db = getDb();
      if (db) {
        const item = await db.collection<IApodData>("apods").findOne({ cacheKey: key });
        if (item) {
          redisClient.set(key, JSON.stringify(item), { EX: 86400 }).catch(() => {});
          return item;
        }
      }
    } catch (err) {
      logger.error({ err }, "Storage.get failed");
    }
    return null;
  },

  async set(key: string, data: IApodData, ttl: number = 86400): Promise<void> {
    try {
      await redisClient.set(key, JSON.stringify(data), { EX: ttl });
      const db = getDb();
      if (db) {
        await db.collection("apods").updateOne(
          { cacheKey: key },
          { $set: { ...data, cacheKey: key, updatedAt: new Date() } },
          { upsert: true }
        );
      }
    } catch (err) {
      logger.error({ err }, "Storage.set failed");
    }
  },

  async init() {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    await connectMongo();
  },
};
