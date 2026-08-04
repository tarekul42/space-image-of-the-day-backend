import express from "express";
import { MetricsController } from "./metrics.controller";

const router = express.Router();

router.get("/summary", MetricsController.getMetricsSummary);
router.get("/prometheus", MetricsController.getPrometheusMetrics);

export const MetricsRoutes = router;
