import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";
import { sendResponse } from "../../utils/response";
import { ApodService } from "./apod.service";

const getApod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date, lang } = req.query;
    const result = await ApodService.getApodByDate(
      date as string,
      lang as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Cosmic data retrieved successfully",
      ...result,
    });
  } catch (error) {
    logger.error({ err: error }, "Error fetching APOD");
    next(error);
  }
};

const getRandomApod = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { lang } = req.query;
    const result = await ApodService.getRandomApod(lang as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Random discovery successful",
      ...result,
    });
  } catch (error) {
    logger.error({ err: error }, "Error fetching random APOD");
    next(error);
  }
};

export const ApodController = {
  getApod,
  getRandomApod,
};
