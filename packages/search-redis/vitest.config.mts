import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  resolve: {
    alias: {
      "@upstash/redis": path.resolve(__dirname, "../redis/dist/nodejs.mjs"),
    },
  },
});
