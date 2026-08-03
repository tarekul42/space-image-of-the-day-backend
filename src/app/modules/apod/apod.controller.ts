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

const getApodRange = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { start_date, end_date, lang, translate } = req.query;
    const shouldTranslate = translate !== "false" && translate !== "0";
    const result = await ApodService.getApodRange(
      start_date as string,
      end_date as string,
      lang as string,
      shouldTranslate,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Weekly cosmic data retrieved successfully",
      ...result,
    });
  } catch (error) {
    logger.error({ err: error }, "Error fetching APOD range");
    next(error);
  }
};

export const ApodController = {
  getApod,
  getRandomApod,
  getApodRange,
};
