import { Response } from "express";

/**
 * Standardize successful API responses.
 */
export const sendResponse = <T>(
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    source?: "cache" | "api";
  },
) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    source: data.source,
    data: data.data,
  });
};
