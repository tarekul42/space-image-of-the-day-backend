import express from "express";
import { ApodRoutes } from "../modules/apod/apod.route";
import { CatalogRoutes } from "../modules/catalog/catalog.route";
import { MetricsRoutes } from "../modules/metrics/metrics.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/apod",
    route: ApodRoutes,
  },
  {
    path: "/catalog",
    route: CatalogRoutes,
  },
  {
    path: "/metrics",
    route: MetricsRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
