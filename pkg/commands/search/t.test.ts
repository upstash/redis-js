import { afterAll, describe, test } from "bun:test";
import { keygen, newHttpClient } from "../../test-utils";
import { createIndex, index as getIndex } from "./search";
import { s } from "./schema-builder";

const client = newHttpClient();
const { cleanup } = keygen();
afterAll(cleanup);

describe("Vercel Changelog", () => {
  test("queries with select", async () => {
    const name = `vercel-changelog`;
    const schema = s.object({
      id: s.text(),
      content: s.object({
        title: s.text(),
        content: s.text(),
        authors: s.text(),
      }),
      metadata: s.object({
        dateInt: s.number("U64"),
        url: s.text(),
        updated: s.date(),
        kind: s.text(),
      }),
    });
    const index = getIndex(client, name, schema);
    const result = await index.describe();
    console.log(JSON.stringify(result, null, 2));
  });
});
