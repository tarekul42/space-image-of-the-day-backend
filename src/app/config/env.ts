import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  PORT: z.string().optional(),
  NASA_API_KEY: z.string(),
  NASA_API_URL: z.string().default("https://api.nasa.gov/planetary/apod"),
  SIMBAD_BASE_URL: z
    .string()
    .default("https://simbad.u-strasbg.fr/simbad/sim-basic"),
  REDIS_URL: z.string(),
  MONGO_URI: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional().default("http://localhost:3000"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
