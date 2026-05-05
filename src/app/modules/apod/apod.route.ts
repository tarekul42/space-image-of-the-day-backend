import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ApodController } from "./apod.controller";
import { ApodValidation } from "./apod.validation";

const router = express.Router();

router.get(
  "/",
  validateRequest(ApodValidation.getApodSchema),
  ApodController.getApod,
);
router.get("/random", ApodController.getRandomApod);

export const ApodRoutes = router;
