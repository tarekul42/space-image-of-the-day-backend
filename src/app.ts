import compression from "compression";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import promBundle from "express-prom-bundle";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { z } from "zod";
import { env } from "./app/config/env";
import router from "./app/route/index";
import redisClient from "./app/config/redis.config";
import { getDb } from "./app/config/mongo.config";
import logger from "./app/utils/logger";

const app: Application = express();

/**
 * Standard Security & Performance Middlewares
 */
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = env.ALLOWED_ORIGINS?.split(",") || [];
      // Allow non-browser (e.g., Postman) or same-origin requests
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Performance & Metrics Middlewares
 */
app.use(compression());
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  promClient: {
    collectDefaultMetrics: {},
  },
});
app.use(metricsMiddleware);

// Simplified Request Logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info({ method: req.method, path: req.path }, "✨ Incoming signal");
  next();
});

/**
 * Rate Limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "🌌 Too many signals from this sector. Please wait.",
  },
});
app.use("/api", limiter);

/**
 * API Routes
 */
app.use("/api/v1", router);

/**
 * Root & Health Check
 */
app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "🌌 Welcome to the Space Image of the Day API!",
    version: "1.0.0",
    endpoints: {
      apod: "/api/v1/apod",
      health: "/health",
    },
  });
});

app.get("/health", async (_req: Request, res: Response) => {
  const checks = {
    redis: false,
    mongo: false,
  };

  try {
    const redisPing = await redisClient.ping();
    checks.redis = redisPing === "PONG";
  } catch {
    checks.redis = false;
  }

  try {
    const db = getDb();
    if (db) {
      await db.command({ ping: 1 });
      checks.mongo = true;
    }
  } catch {
    checks.mongo = false;
  }

  const allUp = checks.redis || (!env.REDIS_URL && checks.mongo);

  res.status(allUp ? 200 : 503).json({
    status: allUp ? "UP" : "DEGRADED",
    timestamp: new Date().toISOString(),
    service: "Space Image of the Day API",
    checks,
  });
});

/**
 * 404 Not Found Handling
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "🚀 Path not found in this galaxy.",
  });
});

/**
 * Global Error Handler
 */
app.use(
  (
    err: Error & { status?: number; statusCode?: number },
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || "Internal Starship Error";

    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Galactic Navigation Error: Invalid request data.",
        issues: err.issues,
      });
    }

    // Use pino to log the full error object
    logger.error({ err, path: req.path }, message);

    res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  },
);

export default app;
