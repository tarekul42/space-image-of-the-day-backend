import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import logger from "../../utils/logger";
import { ApodService } from "./apod.service";

const sendCachedResponse = (req: Request, res: Response, data: any) => {
  const payload = {
    success: true,
    message: "Cosmic data retrieved successfully",
    ...data,
  };
  const bodyStr = JSON.stringify(payload);
  const etag = `"${crypto.createHash("md5").update(bodyStr).digest("hex")}"`;

  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.setHeader("ETag", etag);

  if (req.headers["if-none-match"] === etag) {
    return res.status(304).end();
  }

  res.status(200).json(payload);
};

const getApod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date, lang } = req.query;
    const result = await ApodService.getApodByDate(
      date as string,
      lang as string,
    );
    sendCachedResponse(req, res, result);
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
    sendCachedResponse(req, res, result);
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
    sendCachedResponse(req, res, result);
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
