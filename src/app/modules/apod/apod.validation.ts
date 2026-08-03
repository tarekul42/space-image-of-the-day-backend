import { z } from "zod";

const getApodSchema = z.object({
  query: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .optional(),
  }),
});

const getApodRangeSchema = z.object({
  query: z.object({
    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
    translate: z.string().optional(),
  }),
});

export const ApodValidation = {
  getApodSchema,
  getApodRangeSchema,
};
