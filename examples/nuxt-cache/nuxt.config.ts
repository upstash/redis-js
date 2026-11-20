export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  nitro: {
    storage: {
      cache: {
        driver: "upstash",
        base: "my-app",
        ttl: 60 * 60 * 24,
      },
    },
    devStorage: {
      cache: {
        driver: "upstash",
        base: "my-app-dev",
        ttl: 60 * 60 * 24,
      },
    },
  },
  routeRules: {
    "/api/leaderboard": { swr: 60 },
  },
});
