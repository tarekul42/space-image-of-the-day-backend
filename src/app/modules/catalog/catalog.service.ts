import { COSMIC_CATALOG } from "./catalog.data";
import { ICosmicObject } from "./catalog.interface";

/**
 * Ranked, case-insensitive search over the cosmic catalog.
 * Exact id/name matches outrank prefix matches, which outrank substring hits.
 */
export const searchCatalog = (
  query: string,
  limit: number = 8,
): ICosmicObject[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  return COSMIC_CATALOG.map((obj) => {
    const name = obj.name.toLowerCase();
    const aliases = (obj.aliases ?? []).map((a) => a.toLowerCase());
    const id = obj.id.toLowerCase();

    let score = 0;
    if (id === needle || name === needle) score = 300;
    else if (aliases.includes(needle)) score = 260;
    else if (id.startsWith(needle)) score = 200;
    else if (name.startsWith(needle)) score = 180;
    else if (aliases.some((a) => a.startsWith(needle))) score = 150;
    else if (name.includes(needle)) score = 90;
    else if (aliases.some((a) => a.includes(needle))) score = 60;

    return { obj, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.obj.name.localeCompare(b.obj.name))
    .slice(0, Math.max(1, Math.min(limit, 20)))
    .map((s) => s.obj);
};
