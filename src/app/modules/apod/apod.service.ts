import axios from "axios";
import translate from "google-translate-api-x";
import { env } from "../../config/env.js";
import { StorageService } from "../../services/storage.service.js";
import logger from "../../utils/logger.js";
import { IApodData } from "./apod.interface.js";

const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod";
const CACHE_KEY_PREFIX = "apod:";

/**
 * Helper to translate, enrich, and store APOD data.
 */
const processAndStoreApod = async (
  data: IApodData,
  lang: string = "en",
): Promise<IApodData> => {
  const targetDate = data.date;
  const targetLang = lang;
  const cacheKey = `${CACHE_KEY_PREFIX}${targetLang}:${targetDate}`;

  let processedData = { ...data };

  if (targetLang !== "en") {
    try {
      logger.info(`🌎 Translating APOD to ${targetLang}`);
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
      logger.error(
        err instanceof Error ? err : { err },
        "Translation failed, falling back to English",
      );
    }
  }

  // Enriched data simulation (matching the reference logic)
  const isGalaxy = processedData.explanation.toLowerCase().includes("galaxy");
  const isNebula = processedData.explanation.toLowerCase().includes("nebula");
  const isCluster = processedData.explanation.toLowerCase().includes("cluster");

  const enrichedData: IApodData = {
    ...processedData,
    object_type: isGalaxy
      ? "Galaxy"
      : isNebula
        ? "Nebula"
        : isCluster
          ? "Star Cluster"
          : "Celestial Object",
    constellation: "Unknown Constellation",
    more_info_url: `https://simbad.u-strasbg.fr/simbad/sim-basic?Ident=${encodeURIComponent(processedData.title)}`,
  };

  // Strip unnecessary NASA payload fields to optimize storage size
  const minimalData: IApodData = {
    date: enrichedData.date,
    title: enrichedData.title,
    explanation: enrichedData.explanation,
    url: enrichedData.url,
    hdurl: enrichedData.hdurl,
    media_type: enrichedData.media_type,
    service_version: enrichedData.service_version,
    copyright: enrichedData.copyright,
    object_type: enrichedData.object_type,
    constellation: enrichedData.constellation,
    more_info_url: enrichedData.more_info_url,
  };

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
  const targetDate = date || new Date().toISOString().split("T")[0];
  const targetLang = lang || "en";
  const cacheKey = `${CACHE_KEY_PREFIX}${targetLang}:${targetDate}`;

  try {
    const cachedData = await StorageService.get(cacheKey);
    if (cachedData) {
      logger.info(`🎯 Cache Hit for APOD: ${targetDate} (${targetLang})`);
      return { data: cachedData, source: "cache" };
    }
  } catch (err) {
    logger.error(err instanceof Error ? err : { err }, "Storage fetch error");
  }

  logger.info(`🌐 Fetching APOD from NASA for: ${targetDate}`);
  const response = await axios.get<IApodData>(NASA_APOD_URL, {
    params: {
      api_key: env.NASA_API_KEY,
      date: targetDate,
    },
  });

  return {
    data: await processAndStoreApod(response.data, targetLang),
    source: "api",
  };
};

const getRandomApod = async (
  lang: string = "en",
): Promise<{ data: IApodData; source: "api" | "cache" }> => {
  const targetLang = lang;
  logger.info("🎲 Fetching random APOD from NASA");

  let attempts = 0;
  while (attempts < 3) {
    const response = await axios.get<IApodData | IApodData[]>(NASA_APOD_URL, {
      params: {
        api_key: env.NASA_API_KEY,
        count: 5,
      },
    });

    const items = Array.isArray(response.data)
      ? response.data
      : [response.data];
    const imageItems = items.filter((item) => item.media_type === "image");

    if (imageItems.length > 0) {
      // Logic: Cache all retrieved images to Redis to reduce future latency,
      // but return the first one immediately.
      const firstItem = imageItems[0];

      // We essentially "prime" the cache for these dates/langs
      for (const item of imageItems) {
        // Use helper directly for background caching
        processAndStoreApod(item, targetLang).catch(() => { });
      }

      // Return processed first item immediately - No second network fetch!
      return {
        data: await processAndStoreApod(firstItem, targetLang),
        source: "api",
      };
    }

    attempts++;
    logger.warn("No image found in random APOD fetch, retrying...");
  }

  throw new Error("Failed to find a random image APOD after several attempts");
};

export const ApodService = {
  getApodByDate,
  getRandomApod,
};
