# 🛰️ Space Image of the Day — Nerd-Scale Backend

> _The story of building a production-grade API server that evolved from a simple proxy into a "nerd-scale" persistent archive for the cosmos._

[![Runtime](https://img.shields.io/badge/Runtime-Bun-black)](https://bun.sh)
[![Framework](https://img.shields.io/badge/Framework-Express%20%2B%20TypeScript-blue)](https://expressjs.com)
[![Storage: Fast](https://img.shields.io/badge/Cache-Redis-red)](https://redis.io)
[![Storage: Persistent](https://img.shields.io/badge/Database-MongoDB-green)](https://mongodb.com)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/tarekul42)
[![License](https://img.shields.io/badge/License-MIT-green)](https://github.com/tarekul42)

> **Part of:** [Space Image of the Day Chrome Extension](https://github.com/tarekul42) — see the frontend repo for the full product story.

---

## The Story: From Proxy to Persistence

Every side project starts with a "naïve" phase. Mine was: _"Just call the NASA API directly from the browser extension."_

But as soon as I thought about **Scale**, **Security**, and **Latency**, that plan crumbled. A simple proxy was the next logical step—keep the API key safe, cache the daily image to avoid burning rate limits, and provide a stable data contract.

Then came the **"Nerd-Scale" Problem.**

I wanted several years of history available at sub-millisecond speeds. But Redis (on the free tier) has a 30MB limit. I was storing high-resolution metadata and translations for 11+ languages. One month of data was fine; one year was a crisis.

**The Solution:** A dual-layer storage strategy.
We use **Redis** as our "hot" cache for instant retrieval, backed by **MongoDB** as our permanent galactic archive. If Redis is empty (or limited), we failover to MongoDB, fetch the data, and "back-fill" Redis for the next request.

Now, every user who explores a random date from 1995 isn't just seeing an image; they're contributing to a growing, high-speed archive of the cosmos.

---

## 🛠️ Architecture: Domain-Driven & Scalable

Built with a modular, domain-driven structure that keeps the business logic far away from the HTTP boilerplate.

```text
src/
├── app/
│   ├── config/          # Environment validation & DB connections
│   ├── middlewares/     # Security, Compression, & Metrics
│   ├── modules/
│   │   └── apod/        # Self-contained APOD Domain
│   │       ├── apod.service.ts      # The "Brain": Business logic
│   │       ├── apod.controller.ts   # The "Face": Req/Res handling
│   │       └── apod.test.ts         # The "Guard": Integration tests
│   ├── services/        # Cross-cutting services (StorageService)
│   ├── utils/           # Shared utilities (Pino Logger)
│   └── route/           # Router aggregation
├── app.ts               # Express configuration
└── server.ts            # Entry point & DB initialization
```

---

## ⚡ Smart Features

### 1. Dual-Layer Storage (StorageService)

Transparent failover between Redis and MongoDB.

- **Save**: Write to MongoDB (Permanent) + Redis (Fast).
- **Get**: Priority: Redis → MongoDB Fallback → NASA API (Final Source).

### 2. Cache Priming & Random Discovery

The `/random` endpoint doesn't just fetch one image. It fetches a batch of 5, filters for the highest-quality images (discarding videos), and **primes the cache** for all 5 in the background. The user gets their image instantly, and the next 4 requests from anyone in the world are now "hot" hits.

### 3. Cosmic Enrichment

We don't just return NASA's raw text. Our service:

- **Categorizes**: Detects if an object is a Galaxy, Nebula, or Star Cluster through NLP-lite explanation analysis.
- **Deep-Links**: Provides a direct link to the [SIMBAD Astronomical Database](https://simbad.u-strasbg.fr/) for research-heavy users.
- **Multilingual**: Auto-translates titles and explanations into **11+ languages** (English, Spanish, Bengali, Hindi, etc.) using a zero-cost Google Translate proxy.

### 4. Production Hardening

- **Standard-Sec**: Helmet for headers, CORS for origin control.
- **Gzip Compression**: Every byte counts when serving JSON globally.
- **Pino Structured Logging**: Machine-readable logs for easier debugging.
- **Prometheus Metrics**: Exposes an `/metrics` endpoint for real-time monitoring (Grafana-ready).

---

## 🚀 Technology Stack

| Component      | Technology              | Why?                                                          |
| :------------- | :---------------------- | :------------------------------------------------------------ |
| **Runtime**    | **Bun**                 | Ultra-fast startup and built-in SQLite for small deployments. |
| **Framework**  | **Express**             | The gold standard for middleware-heavy TypeScript APIs.       |
| **Fast-Cache** | **Redis**               | Sub-millisecond latency for today's "hot" image.              |
| **Archive**    | **MongoDB**             | Persistence at scale for "Nerd-Scale" historical data.        |
| **Validation** | **Zod**                 | Type-safe environment and request schemas.                    |
| **Monitoring** | **Prom-Bundle**         | Built-in Prometheus metrics for production visibility.        |
| **Security**   | **Helmet / Rate-Limit** | Basic but essential defense against common web attacks.       |

---

## 📡 API Endpoints

| Method | Endpoint               | Description                                    |
| :----- | :--------------------- | :--------------------------------------------- |
| `GET`  | `/api/v1/apod`         | Today's APOD (Defaults to English).            |
| `GET`  | `/api/v1/apod?lang=bn` | Today's APOD translated to Bengali.            |
| `GET`  | `/api/v1/apod/random`  | Get a random cosmic image (Primed from cache). |
| `GET`  | `/health`              | Service health status.                         |
| `GET`  | `/metrics`             | Prometheus metrics for monitoring.             |

---

## 🛠️ Running Locally

```bash
# 1. Install dependencies
bun install

# 2. Configure environment
cp .env.example .env
# Required: NASA_API_KEY, REDIS_URL, MONGO_URI

# 3. Spin up infrastructure (Docker)
docker run -d -p 6379:6379 redis:alpine
docker run -d -p 27017:27017 mongodb:latest

# 4. Blast off
bun run dev
```

---

## 🗺️ Roadmap

### v1 — Shipped ✅

- [x] Dual-layer Redis + MongoDB Storage.
- [x] Multilingual support (11+ languages).
- [x] Automated SIMBAD deep-linking.
- [x] Prometheus metrics & Gzip compression.
- [x] Background cache priming for random images.

### v2 — Exploration 🔭

- [ ] User authentication for "Favorite Images".
- [ ] Direct Mars Rover image module.
- [ ] GraphQL query support for complex data trees.

---

## 📜 License

MIT — Built with ☕ and 🌌 by [tarekul42](https://github.com/tarekul42)
