import { dnt } from "../deps.ts";

const packageManager = "npm";
const outDir = "./dist";

await dnt.emptyDir(outDir);

await dnt.build({
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
  },
  typeCheck: false,
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
    author: "Andreas Thomas <dev@chronark.com>",
    license: "MIT",
    bugs: {
      url: "https://github.com/upstash/upstash-redis/issues",
    },
    homepage: "https://github.com/upstash/upstash-redis#readme",
    dependencies: {
      "isomorphic-fetch": "^3.0.0",
    },
    /**
     * typesVersion is required to make imports work in typescript.
     * Without this you would not be able to import {} from "@upstash/redis/<some_path>"
     */
    typesVersions: {
      "*": {
        nodejs: "./types/platforms/nodejs.d.ts",
        cloudflare: "./types/platforms/cloudflare.d.ts",
        fastly: "./types/platforms/fastly.d.ts",
        "with-fetch": "./types/platforms/node_with_fetch.d.ts",
      },
    },
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
