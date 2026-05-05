import { Db, MongoClient, ServerApiVersion } from "mongodb";
import logger from "../utils/logger";
import { env } from "./env";

let client: MongoClient | null = null;
let db: Db | null = null;

const MONGO_OPTIONS = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

/**
 * Initialize MongoDB connection.
 * If MONGO_URI is not provided, this returns null and stays in "Cache-Only" mode.
 */
export const connectMongo = async (): Promise<Db | null> => {
  if (!env.MONGO_URI) {
    logger.warn(
      "⚠️ MONGO_URI missing. Persistent storage (MongoDB) is DISABLED.",
    );
    return null;
  }

  if (db) return db;

  try {
    client = new MongoClient(env.MONGO_URI, MONGO_OPTIONS);
    await client.connect();

    // Select the DB (using "space-images" as default)
    db = client.db("space-images");

    // Quick Ping to verify connection
    await db.command({ ping: 1 });

    logger.info("📡 MongoDB: Connection established (Premium storage active)");
    return db;
  } catch (err) {
    logger.error({ err }, "❌ MongoDB: Connection failed");
    return null;
  }
};

/**
 * Gracefully close the MongoDB connection
 */
export const closeMongo = async () => {
  if (client) {
    await client.close();
    logger.info("🔌 MongoDB: Connection closed");
    client = null;
    db = null;
  }
};

export const getDb = (): Db | null => db;
