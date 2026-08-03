import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../../../app";
import redisClient from "../../config/redis.config";

vi.mock("../../config/redis.config", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    connect: vi.fn(),
    on: vi.fn(),
  },
}));

describe("Catalog Module", () => {
  describe("GET /api/v1/catalog/search", () => {
    it("returns matches for a Messier id", async () => {
      const response = await request(app).get("/api/v1/catalog/search?q=m42");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      const m42 = response.body.data.find((o: { id: string }) => o.id === "m42");
      expect(m42).toBeDefined();
      expect(m42.name).toBe("Orion Nebula");
      expect(m42.ra).toBeCloseTo(83.822, 3);
      expect(m42.dec).toBeCloseTo(-5.391, 3);
    });

    it("matches by common alias", async () => {
      const response = await request(app).get("/api/v1/catalog/search?q=seven+sisters");

      expect(response.status).toBe(200);
      expect(response.body.data.some((o: { id: string }) => o.id === "m45")).toBe(true);
    });

    it("ranks exact matches first", async () => {
      const response = await request(app).get("/api/v1/catalog/search?q=nebula");

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].objectType).not.toBe("Planet");
    });

    it("respects the limit param", async () => {
      const response = await request(app).get("/api/v1/catalog/search?q=a&limit=3");

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(3);
    });

    it("returns 400 for an empty query", async () => {
      const response = await request(app).get("/api/v1/catalog/search?q=");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("returns 400 when the query param is missing", async () => {
      const response = await request(app).get("/api/v1/catalog/search");

      expect(response.status).toBe(400);
    });

    it("returns an empty array when nothing matches", async () => {
      const response = await request(app).get("/api/v1/catalog/search?q=zzzzzz");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });
  });
});

// Silence unused import warnings for the mocked redis client.
void redisClient;
