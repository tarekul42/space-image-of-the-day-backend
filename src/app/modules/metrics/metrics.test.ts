import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../../app";

describe("Metrics Module", () => {
  describe("GET /api/v1/metrics/summary", () => {
    it("should return uptime and memory stats", async () => {
      const response = await request(app).get("/api/v1/metrics/summary");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("uptimeSeconds");
      expect(response.body.data).toHaveProperty("memory");
      expect(response.body.data.memory).toHaveProperty("rssMB");
    });
  });

  describe("GET /api/v1/metrics/prometheus", () => {
    it("should return prometheus metrics text", async () => {
      const response = await request(app).get("/api/v1/metrics/prometheus");

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("text/plain");
    });
  });
});
