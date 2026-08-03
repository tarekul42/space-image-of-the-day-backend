import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CatalogController } from "./catalog.controller";
import { CatalogValidation } from "./catalog.validation";

const router = express.Router();

router.get(
  "/search",
  validateRequest(CatalogValidation.searchSchema),
  CatalogController.search,
);

export const CatalogRoutes = router;
