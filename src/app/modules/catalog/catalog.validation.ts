import { z } from "zod";

const searchSchema = z.object({
  query: z.object({
    q: z
      .string()
      .trim()
      .min(1, "Query must be at least 1 character"),
    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be an integer")
      .optional(),
  }),
});

export const CatalogValidation = {
  searchSchema,
};