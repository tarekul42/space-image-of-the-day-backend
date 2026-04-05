import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import { ApodController } from "./apod.controller.js";
import { ApodValidation } from "./apod.validation.js";

const router = Router();

router.get(
  "/",
  validateRequest(ApodValidation.getApodSchema),
  ApodController.getApod,
);
router.get("/random", ApodController.getRandomApod);

export const ApodRoutes = router;
