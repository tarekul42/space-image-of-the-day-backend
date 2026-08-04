import { Request, Response } from "express";
import { register } from "prom-client";

const getMetricsSummary = async (_req: Request, res: Response) => {
  const memory = process.memoryUsage();
  const uptime = process.uptime();

  res.json({
    success: true,
    data: {
      uptimeSeconds: Math.floor(uptime),
      memory: {
        rssMB: Math.round(memory.rss / (1024 * 1024)),
        heapTotalMB: Math.round(memory.heapTotal / (1024 * 1024)),
        heapUsedMB: Math.round(memory.heapUsed / (1024 * 1024)),
      },
      timestamp: new Date().toISOString(),
    },
  });
};

const getPrometheusMetrics = async (_req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
};

export const MetricsController = {
  getMetricsSummary,
  getPrometheusMetrics,
};
