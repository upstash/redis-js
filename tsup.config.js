import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "platforms/nodejs.ts",
    "platforms/cloudflare.ts",
    "platforms/fastly.ts",
    "pkg/commands/**/!(*.test).ts",
  ],
  format: ["cjs", "esm"],
  splitting: false,
  sourcemap: false,
  clean: true,
  bundle: true,
  dts: true,
  minify: true,
  minifyWhitespace: true,
});
