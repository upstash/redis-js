import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "./pkg/index.ts",
    commands: "./pkg/commands/index.ts",
  },
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
  splitting: false,
  minify: false,
})
