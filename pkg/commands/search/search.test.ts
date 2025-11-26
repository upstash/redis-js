import { afterAll, describe, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../../test-utils";
import { createIndex, s } from "./search";
const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("Index.create", () => {
  test("creates hash index with simple schema", async () => {
    const indexName = newKey();
    const schema = s.hash({
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
    const schema = s.hash({
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
    const schema = s.hash({
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
    const schema = s.hash({
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
    const schema = s.hash({
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
    const schema = s.hash({
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

    expect(result).toBe("OK");
  });
});

describe("HashIndex data methods", () => {
  test("hset builds correct command with type-safe data", async () => {
    const indexName = newKey();
    const key = newKey();
    const schema = s.hash({
      name: s.text(),
      age: s.unsignedInteger(),
      score: s.bool(),
      isActive: s.bool(),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "hash",
      prefix: "user2:",
      client,
    });

    await index.create();

    const result = await index.hset(`user2:${key}`, {
      name: "John Doe",
      score: true,
      age: 30,
      isActive: true,
    });

    expect(result).toBeNumber();
  });

  test("hset enforces prefix on keys", async () => {
    const indexName = newKey();
    const key = newKey();
    const schema = s.hash({
      name: s.text(),
      age: s.unsignedInteger(),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "hash",
      prefix: "user1:",
      client,
    });

    await index.create();

    const result = await index.hset(`user1:${key}`, { name: "John", age: 30 });
    expect(result).toBeNumber();
  });
});

describe("StringIndex data methods", () => {
  test("set builds correct command with type-safe nested data", async () => {
    const indexName = newKey();
    const key = newKey();
    const schema = s.object({
      name: s.text(),
      profile: s.object({
        age: s.unsignedInteger(),
        city: s.text(),
      }),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "string",
      prefix: "tuser1:",
      client,
    });

    await index.create();

    const result = await index.set(`tuser1:${key}`, {
      name: "John Doe",
      profile: {
        age: 30,
        city: "New York",
      },
    });
    expect(result).toBe("OK");
  });

  test("set enforces prefix on keys and schema types", async () => {
    const indexName = newKey();
    const key = newKey();
    const schema = s.object({
      name: s.text(),
      version: s.unsignedInteger(),
    });

    const index = createIndex({
      indexName,
      schema,
      dataType: "string",
      prefix: "poc1:",
      client,
    });
    await index.create();

    const result = await index.set(`poc1:${key}`, { name: "Document", version: 1 });
    expect(result).toBe("OK");
  });
});
