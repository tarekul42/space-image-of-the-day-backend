import express from "express";
import { ApodRoutes } from "../modules/apod/apod.route";
import { CatalogRoutes } from "../modules/catalog/catalog.route";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
