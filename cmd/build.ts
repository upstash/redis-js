import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

const packageManager = "pnpm";
const outDir = "./dist";

await emptyDir(outDir);

await build({
  packageManager,
  entryPoints: [
    "pkg/nodejs.ts",
    {
      name: "./nodejs",
      path: "./pkg/nodejs.ts",
    },
    {
      name: "./cloudflare",
      path: "./pkg/cloudflare.ts",
    },
    {
      name: "./fastly",
      path: "./pkg/fastly.ts",
    },
  ],
  outDir,
  shims: {
    custom: [
      {
        package: { name: "isomorphic-fetch", version: "3.0.0" },
        globalNames: [],
      },
      {
        package: { name: "@types/node", version: "latest" },
        typesPackage: { name: "@types/node", version: "latest" },
        globalNames: [],
      },
    ],
  },
  typeCheck: true,
  test: false,
  package: {
    // package.json properties
    name: "@upstash/redis",
    version: Deno.args[0],
    description:
      "An HTTP/REST based Redis client built on top of Upstash REST API.",
    repository: {
      type: "git",
      url: "git+https://github.com/upstash/upstash-redis.git",
    },
    keywords: ["redis", "database", "serverless", "edge", "upstash"],
    author: "Andreas Thomas <andreas.thomas@chronark.com>",
    license: "MIT",
    bugs: {
      url: "https://github.com/upstash/upstash-redis/issues",
    },
    homepage: "https://github.com/upstash/upstash-redis#readme",
    browser: {
      "isomorphic-fetch": false,
      http: false,
      https: false,
    },

    "size-limit": [
      {
        path: "dist/index.js",
        limit: "6 KB",
      },
      {
        path: "dist/index.mjs",
        limit: "6 KB",
      },
      {
        path: "dist/cloudflare.js",
        limit: "6 KB",
      },
      {
        path: "dist/cloudflare.mjs",
        limit: "6 KB",
      },
      {
        path: "dist/nodejs.js",
        limit: "6 KB",
      },
      {
        path: "dist/nodejs.mjs",
        limit: "6 KB",
      },
      {
        path: "dist/fastly.js",
        limit: "6 KB",
      },
      {
        path: "dist/fastly.mjs",
        limit: "6 KB",
      },
    ],
  },
});

// post build steps
Deno.copyFileSync(".github/LICENSE", `${outDir}/LICENSE`);
Deno.copyFileSync(".github/README.md", `${outDir}/README.md`);
Deno.copyFileSync("./dist/esm/nodejs.js", "./dist/index.mjs");
Deno.copyFileSync("./dist/script/nodejs.js", "./dist/index.js");
Deno.copyFileSync("./dist/types/nodejs.d.ts", "./dist/index.d.ts");

/**
 * Workaround because currently deno can not typecheck the built modules without `@types/node` being installed as regular dependency
 *
 * This removes it after everything is tested.
 */
await Deno.run({
  cwd: outDir,
  cmd: [packageManager, "remove", "@types/node"],
  stdout: "piped",
}).output();
