import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["platforms/nodejs.ts", "platforms/cloudflare.ts", "platforms/fastly.ts"],
  format: ["cjs", "esm"],
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  dts: true,
});
