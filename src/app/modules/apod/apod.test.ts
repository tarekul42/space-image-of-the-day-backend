import axios from "axios";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../../../app";
import redisClient from "../../config/redis.config";

vi.mock("axios");
vi.mock("../../config/redis.config", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    connect: vi.fn(),
    on: vi.fn(),
  },
}));

const mockedAxios = vi.mocked(axios);

describe("APOD Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/apod", () => {
    it("should return APOD data from cache if available", async () => {
      const mockData = {
        title: "M42: The Orion Nebula",
        url: "https://apod.nasa.gov/apod/image/2404/Orion_Nebula_640.jpg",
        hdurl: "https://apod.nasa.gov/apod/image/2404/Orion_Nebula_HD.jpg",
        explanation:
          "The Great Orion Nebula is an immense, nearby star-forming region.",
        date: "2024-04-03",
        media_type: "image",
        object_type: "Nebula",
      };
      vi.mocked(redisClient.get).mockResolvedValue(JSON.stringify(mockData));

      const response = await request(app).get("/api/v1/apod");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.source).toBe("cache");
      expect(response.body.data.title).toBe("M42: The Orion Nebula");
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it("should return APOD data from API if not in cache", async () => {
      vi.mocked(redisClient.get).mockResolvedValue(null);
      mockedAxios.get.mockResolvedValue({
        data: {
          title: "Andromeda Galaxy",
          url: "https://apod.nasa.gov/apod/image/2404/Andromeda_640.jpg",
          explanation: "The Andromeda Galaxy is a barred spiral galaxy...",
          date: "2024-04-03",
          media_type: "image",
        },
      });

      const response = await request(app).get("/api/v1/apod");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.source).toBe("api");
      expect(response.body.data.object_type).toBe("Galaxy");
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it("should return 400 for invalid date format", async () => {
      const response = await request(app).get("/api/v1/apod?date=invalid-date");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/apod/random", () => {
    it("should return a random APOD", async () => {
      mockedAxios.get.mockResolvedValue({
        data: [
          {
            title: "Pleiades Star Cluster",
            url: "https://apod.nasa.gov/apod/image/2404/Pleiades_640.jpg",
            explanation:
              "The Pleiades or Seven Sisters is an open star cluster...",
            date: "2024-04-03",
            media_type: "image",
          },
        ],
      });

      const response = await request(app).get("/api/v1/apod/random");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Pleiades Star Cluster");
    });
  });
});
