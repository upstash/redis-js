import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["platforms/nodejs.ts", "platforms/cloudflare.ts", "platforms/fastly.ts"],
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
});
