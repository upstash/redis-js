import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

const packageManager = "npm";
const outDir = "./dist";

await emptyDir(outDir);

await build({
  packageManager,
  entryPoints: [
    "platforms/nodejs.ts",
    {
      name: "./nodejs",
      path: "./platforms/nodejs.ts",
    },

    {
      name: "./cloudflare",
      path: "./platforms/cloudflare.ts",
    },
    {
      name: "./fastly",
      path: "./platforms/fastly.ts",
    },
    {
      name: "./with-fetch",
      path: "./platforms/node_with_fetch.ts",
    },
  ],
  outDir,
  shims: {
    deno: "dev",
    crypto: "dev",
    custom: [
      /**
       * Workaround for testing the build in nodejs
       */
      {
        package: { name: "@types/node", version: "latest" },
        typesPackage: { name: "@types/node", version: "latest" },
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
  test: typeof Deno.env.get("TEST") !== "undefined",
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
    dependencies: {
      "isomorphic-fetch": "^3.0.0",
    },
    homepage: "https://github.com/upstash/upstash-redis#readme",
    browser: {
      "isomorphic-fetch": false,
      http: false,
      https: false,
    },
    devDependencies: {
      "size-limit": "latest",
      "@size-limit/preset-small-lib": "latest",
    },
    "size-limit": [
      {
        path: "esm/platforms/nodejs.js",
        limit: "5 KB",
      },
      {
        path: "esm/platforms/fastly.js",
        limit: "5 KB",
      },
      {
        path: "esm/platforms/cloudflare.js",
        limit: "5 KB",
      },

      {
        path: "script/platforms/nodejs.js",
        limit: "10 KB",
      },
      {
        path: "script/platforms/fastly.js",
        limit: "10 KB",
      },
      {
        path: "script/platforms/cloudflare.js",
        limit: "10 KB",
      },
    ],
  },
});

// post build steps
Deno.copyFileSync("LICENSE", `${outDir}/LICENSE`);
Deno.copyFileSync("README.md", `${outDir}/README.md`);
Deno.copyFileSync(".releaserc", `${outDir}/.releaserc`);

/**
 * Workaround because currently deno can not typecheck the built modules without `@types/node` being installed as regular dependency
 *
 * This removes it after everything is tested.
 */
await Deno.run({
  cwd: outDir,
  cmd: [packageManager, "uninstall", "@types/node"],
  stdout: "piped",
}).output();
