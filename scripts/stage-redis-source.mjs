import { cp, readFile, readdir, writeFile } from "node:fs/promises";
import { URL } from "node:url";

const root = new URL("../packages/redis/", import.meta.url);
const source = new URL("dist/src/", root);

await cp(new URL("pkg/", root), source, { recursive: true });
await cp(new URL("platforms/", root), new URL("platforms/", source), { recursive: true });
await cp(new URL("version.ts", root), new URL("version.ts", source));

// Flatten pkg/ only in the published source, keeping relative imports navigable.
for (const file of await readdir(source, { recursive: true })) {
  if (!file.endsWith(".ts")) continue;
  const url = new URL(file, source);
  const original = await readFile(url, "utf8");
  const prefix = file.startsWith("platforms/") ? "../" : "./";
  const updated = original
    .replaceAll(/(from\s+["'])\.\.\/pkg\//g, `$1${prefix}`)
    .replaceAll(/(from\s+["'])\.\.\/platforms\//g, "$1./platforms/");
  if (updated !== original) await writeFile(url, updated);
}
