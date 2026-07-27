import axios from "axios";
import translate from "google-translate-api-x";
import { env } from "../../config/env";
import { StorageService } from "../../services/storage.service";
import logger from "../../utils/logger";
import { IApodData } from "./apod.interface";

const CACHE_KEY_PREFIX = "apod:";

/**
 * Standardize defaults for date and language.
 */
const getDefaults = (date?: string, lang?: string) => ({
  targetDate: date || new Date().toISOString().split("T")[0],
  targetLang: lang || "en",
});

/**
 * Helper to translate, enrich, and store APOD data.
 */
const processAndStoreApod = async (
  data: IApodData,
  lang: string = "en",
): Promise<IApodData> => {
  const { targetDate, targetLang } = getDefaults(data.date, lang);
  const cacheKey = `${CACHE_KEY_PREFIX}${targetLang}:${targetDate}`;

  let processedData = { ...data };

  if (targetLang !== "en") {
    try {
      logger.info({ lang: targetLang }, "🌎 Translating APOD");
      const [titleRes, expRes] = await Promise.all([
        translate(data.title, { to: targetLang }),
        translate(data.explanation, { to: targetLang }),
      ]);
      processedData = {
        ...processedData,
        title: titleRes.text,
        explanation: expRes.text,
      };
    } catch (err) {
      logger.warn({ err }, "Translation failed, falling back to English");
      processedData.warning = "Translation unavailable; showing English";
    }
  }

  // Enriched data simulation
  const exp = processedData.explanation.toLowerCase();
  const objectType = exp.includes("galaxy")
    ? "Galaxy"
    : exp.includes("nebula")
      ? "Nebula"
      : exp.includes("cluster")
        ? "Star Cluster"
        : "Celestial Object";

  const enrichedData: IApodData = {
    ...processedData,
    object_type: objectType,
    constellation: "Unknown Constellation",
    more_info_url: `${env.SIMBAD_BASE_URL}?Ident=${encodeURIComponent(processedData.title)}`,
  };

  // Strip unnecessary NASA payload fields to optimize storage size
  const { date, title, explanation, url, hdurl, media_type, service_version, copyright, object_type, constellation, more_info_url, warning } = enrichedData;
  const minimalData: IApodData = { date, title, explanation, url, hdurl, media_type, service_version, copyright, object_type, constellation, more_info_url, warning };

  await StorageService.set(cacheKey, minimalData);

  return enrichedData;
};

/**
 * Fetch Astronomical Picture of the Day.
 * Checks StorageService first (Redis -> MongoDB), then calls NASA API.
 */
const getApodByDate = async (
  date?: string,
  lang?: string,
): Promise<{ data: IApodData; source: "cache" | "api" }> => {
  const { targetDate, targetLang } = getDefaults(date, lang);
  const cacheKey = `${CACHE_KEY_PREFIX}${targetLang}:${targetDate}`;

  const cachedData = await StorageService.get(cacheKey);
  if (cachedData) {
    logger.info({ date: targetDate, lang: targetLang }, "🎯 Cache Hit for APOD");
    return { data: cachedData, source: "cache" };
  }

  logger.info({ date: targetDate }, "🌐 Fetching APOD from NASA");
  const response = await axios.get<IApodData>(env.NASA_API_URL, {
    params: { api_key: env.NASA_API_KEY, date: targetDate },
    timeout: 10_000,
  });

  return {
    data: await processAndStoreApod(response.data, targetLang),
    source: "api",
  };
};

const getRandomApod = async (
  lang: string = "en",
): Promise<{ data: IApodData; source: "api" | "cache" }> => {
  logger.info("🎲 Fetching random APOD from NASA");

  for (let i = 0; i < 3; i++) {
    const response = await axios.get<IApodData | IApodData[]>(env.NASA_API_URL, {
      params: { api_key: env.NASA_API_KEY, count: 5 },
      timeout: 10_000,
    });

    const imageItems = (Array.isArray(response.data) ? response.data : [response.data])
      .filter((item) => item.media_type === "image");

    if (imageItems.length > 0) {
      // Background priming
      imageItems.forEach(item => processAndStoreApod(item, lang).catch(() => {}));

      return {
        data: await processAndStoreApod(imageItems[0], lang),
        source: "api",
      };
    }
    logger.warn("No image found in random APOD fetch, retrying...");
  }

  throw new Error("Failed to find a random image APOD after several attempts");
};

const getApodRange = async (
  start_date: string,
  end_date: string,
  lang: string = "en",
): Promise<{ data: IApodData[]; source: "api" | "cache" }> => {
  logger.info({ start_date, end_date }, "📅 Fetching APOD range from NASA");
  const response = await axios.get<IApodData[]>(env.NASA_API_URL, {
    params: { api_key: env.NASA_API_KEY, start_date, end_date },
    timeout: 10_000,
  });

  const items = (Array.isArray(response.data) ? response.data : [response.data])
    .filter((item) => item.media_type === "image");

  const processed = await Promise.all(
    items.map(async (item) => {
      try {
        return await processAndStoreApod(item, lang);
      } catch {
        return item;
      }
    }),
  );

  return { data: processed, source: "api" };
};

export const ApodService = {
  getApodByDate,
  getRandomApod,
  getApodRange,
};
