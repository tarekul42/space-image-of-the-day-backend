import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";
import { sendResponse } from "../../utils/response";
import { searchCatalog } from "./catalog.service";

const searchCatalogHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { q, limit } = req.query;
    const data = searchCatalog(q as string, Number(limit as string) || 8);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Cosmic catalog search complete",
      data,
    });
  } catch (error) {
    logger.error({ err: error }, "Error searching cosmic catalog");
    next(error);
  }
};

export const CatalogController = {
  search: searchCatalogHandler,
};