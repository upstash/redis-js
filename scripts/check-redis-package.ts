import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const directory = fileURLToPath(new URL("../packages/redis/dist/", import.meta.url));
const [pack] = JSON.parse(
  execFileSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: directory,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  })
) as { files: { path: string }[] }[];
const files = new Set(pack.files.map((file) => file.path));

for (const platform of ["nodejs", "cloudflare", "fastly"]) {
  for (const extension of ["js", "mjs", "d.ts", "d.mts"]) {
    assert(files.has(`${platform}.${extension}`), `Missing ${platform}.${extension}`);
  }
  assert(files.has(`src/platforms/${platform}.ts`), `Missing ${platform} source`);
}

for (const file of [
  "src/pkg/redis.ts",
  "src/pkg/http.ts",
  "src/pkg/commands/get.ts",
  "src/version.ts",
  "docs/overview.mdx",
  "docs/getstarted.mdx",
  "docs/commands/string/get.mdx",
]) {
  assert(files.has(file), `Missing ${file}`);
}

for (const file of files) {
  assert(
    !/^src\/.*(?:\.(?:test|test-d|spec)\.|\/test-utils\.|\/__(?:tests|snapshots)__\/)/.test(file),
    `Unexpected test file: ${file}`
  );
}
