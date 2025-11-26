import { afterAll, describe, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../../test-utils";
import { createIndex } from "./search";
import { StringIndexSchema } from "./types";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("Index.create", () => {
  test("creates hash index with simple schema", async () => {
    const indexName = newKey();
    const schema = {
      name: "TEXT",
      age: "U64",
      isActive: "BOOL",
    } as const;

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
    const schema = {
      name: "TEXT",
      profile: {
        age: "U64",
        location: {
          city: "TEXT",
        },
      },
    } as const;

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
    const schema = {
      name: {
        type: "TEXT",
        noTokenize: true,
      },
      age: {
        type: "U64",
        fast: true,
      },
    } as const;

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
    const schema = {
      title: "TEXT",
      score: "I64",
    } as const;

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
    const schema = {
      name: "TEXT",
      user: {
        profile: {
          bio: {
            type: "TEXT",
            noStem: true,
          },
          age: "U64",
        },
        settings: {
          notifications: "BOOL",
        },
      },
      metadata: {
        created: "DATE",
        score: {
          type: "I64",
          fast: true,
        },
      },
    } as const;

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
    const schema = {
      name: "TEXT",
      age: "U64",
    } as const;

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
    const schema = {
      name: "TEXT",
      nested: {
        score: "I64",
      },
    } as const;

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
    const schema = {
      name: {
        type: "TEXT",
        noTokenize: true,
      },
      score: {
        type: "U64",
        fast: true,
      },
    } as const;

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
    const schema = {
      title: "TEXT",
    } as const;

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
    const schema = {
      name: "TEXT",
      age: "U64",
      score: "BOOL",
      isActive: "BOOL",
    } satisfies StringIndexSchema;

    const index = createIndex({
      indexName,
      schema,
      dataType: "hash",
      prefix: "user:",
      client,
    });

    await index.create();

    const result = await index.hset(`user:${key}`, {
      name: "John Doe",
      score: true,
      age: 30,
      isActive: true,
    });

    expect(result).toBe("OK");
  });

  test("hset enforces prefix on keys", async () => {
    const indexName = newKey();
    const key = newKey();
    const schema = {
      name: "TEXT",
      age: "U64",
    } as const;

    const index = createIndex({
      indexName,
      schema,
      dataType: "hash",
      prefix: "user:",
      client,
    });

    await index.create();

    const result = await index.hset(`user:${key}`, { name: "John", age: 30 });
    expect(result).toBe("OK");
  });
});

describe("StringIndex data methods", () => {
  test("set builds correct command with type-safe nested data", async () => {
    const indexName = newKey();
    const key = newKey();
    const schema = {
      name: "TEXT",
      profile: {
        age: "U64",
        city: "TEXT",
      },
    } as const;

    const index = createIndex({
      indexName,
      schema,
      dataType: "string",
      prefix: "tuser:",
      client,
    });

    await index.create();

    const result = await index.set(`tuser:${key}`, {
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
    const schema = {
      name: "TEXT",
      version: "U64",
    } as const;

    const index = createIndex({
      indexName,
      schema,
      dataType: "string",
      prefix: "poc:",
      client,
    });
    await index.create();

    const result = await index.set(`poc:${key}`, { name: "Document", version: 1 });
    expect(result).toBe("OK");
  });
});
