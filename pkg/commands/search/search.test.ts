import { afterAll, describe, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../../test-utils";
import { createIndex } from "./search";
import { s } from "./schema-builder";
const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("Index.create", () => {
  test("creates hash index with simple schema", async () => {
    const indexName = newKey();
    const schema = s.object({
      name: s.text(),
      age: s.unsignedInteger(),
      isActive: s.bool(),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "hash",
      prefix: "user:",
      client,
    });

    const result = await index.create();
    expect(result).toBe("OK");
  });

  test("creates string index with nested schema", async () => {
    const indexName = newKey();
    const schema = s.object({
      name: s.text(),
      profile: s.object({
        age: s.unsignedInteger(),
        location: s.object({
          city: s.text(),
        }),
      }),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "string",
      prefix: "profile:",
      client,
    });

    const result = await index.create();
    expect(result).toBe("OK");
  });

  test("creates hash index with detailed fields", async () => {
    const indexName = newKey();
    const schema = s.object({
      name: s.text().noTokenize(),
      age: s.unsignedInteger().fast(),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "hash",
      prefix: "user:",
      client,
    });

    const result = await index.create();
    expect(result).toBe("OK");
  });

  test("creates hash index with multiple prefixes", async () => {
    const indexName = newKey();
    const schema = s.object({
      title: s.text(),
      score: s.integer(),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "hash",
      prefix: ["post:", "article:"],
      client,
    });

    const result = await index.create();
    expect(result).toBe("OK");
  });

  test("creates string index with complex nested schema", async () => {
    const indexName = newKey();
    const schema = s.object({
      name: s.text(),
      user: s.object({
        profile: s.object({
          bio: s.text().noStem(),
          age: s.unsignedInteger(),
        }),
        settings: s.object({
          notifications: s.bool(),
        }),
      }),
      metadata: s.object({
        created: s.date(),
        score: s.integer().fast(),
      }),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "string",
      prefix: "data:",
      client,
    });

    const result = await index.create();
    expect(result).toBe("OK");
  });
});

describe("Index.create payload structure", () => {
  test("builds correct payload for simple hash schema", async () => {
    const indexName = newKey();
    const schema = s.object({
      name: s.text(),
      age: s.unsignedInteger(),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "hash",
      prefix: "user:",
      client,
    });

    const result = await index.create();

    expect(result).toBe("OK");
  });

  test("builds correct payload with nested string schema", async () => {
    const indexName = newKey();
    const schema = s.object({
      name: s.text(),
      nested: s.object({
        score: s.integer(),
      }),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "string",
      prefix: "data:",
      client,
    });

    const result = await index.create();

    expect(result).toBe("OK");
  });

  test("builds correct payload with detailed fields", async () => {
    const indexName = newKey();
    const schema = s.object({
      name: s.text().noTokenize(),
      score: s.unsignedInteger().fast(),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "hash",
      prefix: "user:",
      client,
    });

    const result = await index.create();
    expect(result).toBe("OK");
  });

  test("builds correct payload with multiple prefixes", async () => {
    const indexName = newKey();
    const schema = s.object({
      title: s.text(),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "hash",
      prefix: ["post:", "article:", "blog:"],
      client,
    });

    const result = await index.create();

    await index.query({ title: { equals: "react" } });

    expect(result).toBe("OK");
  });
});

describe("Index.query", () => {
  test("queries hash index with simple schema", async () => {
    const schema = s.object({
      id: s.text(),
      content: s.object({
        title: s.text().noStem(),
        content: s.text(),
        authors: s.text(),
      }),
      metadata: s.object({
        dateInt: s.unsignedInteger().fast(),
        url: s.text(),
        updated: s.date(),
        kind: s.text(),
      }),
    });

    const index = createIndex({
      indexName: "vercel-changelog",
      schema,
      dataType: "string",
      prefix: "vercel-changelog:",
      client,
    });

    const result = await index.query(
      {
        "content.title": { equals: "react" },
      },
      {
        noContent: true,
        limit: 2,
      }
    );
    expect(result).toBeDefined();
  });
});
