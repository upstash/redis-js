import { afterAll, afterEach, beforeAll, describe, expect, test } from "bun:test";
import { newHttpClient, randomID } from "../../test-utils";
import { createIndex, index as getIndex, SearchIndex } from "./search";
import { s } from "./schema-builder";
import { JsonSetCommand } from "../json_set";
import { SetCommand } from "../set";
import { HSetCommand } from "../hset";
import { DelCommand } from "../del";

const client = newHttpClient();

describe("createIndex", () => {
  const createdIndexes: string[] = [];

  afterEach(async () => {
    // Cleanup created indexes
    for (const name of createdIndexes) {
      try {
        const index = getIndex(client, name);
        await index.drop();
      } catch {
        // Index might not exist, ignore
      }
    }
    createdIndexes.length = 0;
  });

  test("creates a string index with simple schema", async () => {
    const name = `test-string-${randomID().slice(0, 8)}`;
    createdIndexes.push(name);

    const schema = s.object({
      name: s.string(),
      age: s.number(),
    });

    const index = await createIndex(client, {
      name: name,
      schema,
      dataType: "string",
      prefix: `${name}:`,
    });

    expect(index).toBeInstanceOf(SearchIndex);
    expect(index.name).toBe(name);
  });

  test("creates a string index with nested schema", async () => {
    const name = `test-string-nested-${randomID().slice(0, 8)}`;
    createdIndexes.push(name);

    const schema = s.object({
      title: s.string(),
      metadata: s.object({
        author: s.string(),
        views: s.number("U64"),
      }),
    });

    const index = await createIndex(client, {
      name,
      schema,
      dataType: "string",
      prefix: `${name}:`,
    });

    expect(index).toBeInstanceOf(SearchIndex);
  });

  test("creates a hash index", async () => {
    const name = `test-hash-${randomID().slice(0, 8)}`;
    createdIndexes.push(name);

    const schema = s.object({
      title: s.string(),
      count: s.number("U64"),
    });

    const index = await createIndex(client, {
      name,
      schema,
      dataType: "hash",
      prefix: `${name}:`,
    });

    expect(index).toBeInstanceOf(SearchIndex);
  });

  test("creates a json index with simple schema", async () => {
    const name = `test-json-${randomID().slice(0, 8)}`;
    createdIndexes.push(name);

    const schema = s.object({
      name: s.string(),
      age: s.number(),
    });

    const index = await createIndex(client, {
      name: name,
      schema,
      dataType: "json",
      prefix: `${name}:`,
    });

    expect(index).toBeInstanceOf(SearchIndex);
    expect(index.name).toBe(name);
  });

  test("creates a json index with nested schema", async () => {
    const name = `test-json-nested-${randomID().slice(0, 8)}`;
    createdIndexes.push(name);

    const schema = s.object({
      title: s.string(),
      metadata: s.object({
        author: s.string(),
        views: s.number("U64"),
      }),
    });

    const index = await createIndex(client, {
      name,
      schema,
      dataType: "json",
      prefix: `${name}:`,
    });

    expect(index).toBeInstanceOf(SearchIndex);
  });

  test("creates index with language option", async () => {
    const name = `test-lang-${randomID().slice(0, 8)}`;
    createdIndexes.push(name);

    const schema = s.object({
      content: s.string(),
    });

    const index = await createIndex(client, {
      name,
      schema,
      dataType: "string",
      prefix: `${name}:`,
      language: "turkish",
    });

    expect(index).toBeInstanceOf(SearchIndex);
  });

  test("creates index with multiple prefixes", async () => {
    const name = `test-multi-prefix-${randomID().slice(0, 8)}`;
    createdIndexes.push(name);

    const schema = s.object({
      name: s.string(),
    });

    const index = await createIndex(client, {
      name,
      schema,
      dataType: "hash",
      prefix: [`${name}:users:`, `${name}:profiles:`],
    });

    expect(index).toBeInstanceOf(SearchIndex);
  });
});

describe("SearchIndex.query (string)", () => {
  const name = `test-query-string-${randomID().slice(0, 8)}`;
  const prefix = `${name}:`;
  const keys: string[] = [];

  const schema = s.object({
    name: s.string(),
    description: s.string(),
    category: s.string().noTokenize(),
    price: s.number(),
    stock: s.number("U64"),
    active: s.boolean(),
  });

  beforeAll(async () => {
    // Create the index
    const index = await createIndex(client, {
      name,
      schema,
      dataType: "string",
      prefix,
    });

    // Add test data
    const testData = [
      {
        name: "Laptop Pro",
        description: "High performance laptop",
        category: "electronics",
        price: 1299.99,
        stock: 50,
        active: true,
      },
      {
        name: "Laptop Basic",
        description: "Budget friendly laptop",
        category: "electronics",
        price: 599.99,
        stock: 100,
        active: true,
      },
      {
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse",
        category: "electronics",
        price: 29.99,
        stock: 200,
        active: true,
      },
      {
        name: "USB Cable",
        description: "Fast charging USB cable",
        category: "accessories",
        price: 9.99,
        stock: 500,
        active: true,
      },
      {
        name: "Phone Case",
        description: "Protective phone case",
        category: "accessories",
        price: 19.99,
        stock: 300,
        active: false,
      },
      {
        name: "Headphones",
        description: "Noise cancelling headphones",
        category: "audio",
        price: 199.99,
        stock: 75,
        active: true,
      },
      {
        name: "Keyboard",
        description: "Mechanical gaming keyboard",
        category: "electronics",
        price: 149.99,
        stock: 60,
        active: true,
      },
      {
        name: "Monitor",
        description: "4K Ultra HD monitor",
        category: "electronics",
        price: 449.99,
        stock: 30,
        active: true,
      },
    ];

    for (const [i, testDatum] of testData.entries()) {
      const key = `${prefix}${i}`;
      keys.push(key);
      await new SetCommand([key, JSON.stringify(testDatum)]).exec(client);
    }

    await index.waitIndexing();
  });

  afterAll(async () => {
    // Cleanup
    const index = getIndex(client, name, schema);
    try {
      await index.drop();
    } catch {
      // Ignore
    }
    if (keys.length > 0) {
      await new DelCommand(keys).exec(client);
    }
  });

  describe("text field queries", () => {
    test("queries with $eq on text field", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({ filter: { name: { $eq: "Laptop" } } });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $fuzzy for typo tolerance", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { name: { $fuzzy: { $value: "Laptopp", $distance: 2 } } },
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $fuzzy for typo tolerance - simple string", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { name: { $fuzzy: "laptopp" } },
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $phrase for exact phrase matching", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { description: { $phrase: { $value: "wireless mouse", $prefix: true } } },
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $phrase for exact phrase matching - simple string", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { description: { $phrase: "wireless mouse" } },
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $regex pattern", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { name: { $regex: "Laptop.*" } },
      });

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("numeric field queries", () => {
    test("queries with $gt on numeric field", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({ filter: { price: { $gt: 500 } } });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $gte on numeric field", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({ filter: { stock: { $gte: 100 } } });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $lt on numeric field", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({ filter: { price: { $lt: 50 } } });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $lte on numeric field", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { stock: { $lte: 50 } },
      });

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("boolean field queries", () => {
    test("queries with $eq on boolean field", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({ filter: { active: { $eq: false } } });

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("query options", () => {
    test("queries with limit option", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({ filter: { category: { $eq: "electronics" } }, limit: 2 });

      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(2);
    });

    test("queries with offset for pagination", async () => {
      const index = getIndex(client, name, schema);
      const firstPage = await index.query({
        filter: { category: { $eq: "electronics" } },
        limit: 2,
        offset: 0,
      });

      const secondPage = await index.query({
        filter: { category: { $eq: "electronics" } },
        limit: 2,
        offset: 2,
      });

      expect(firstPage.length).toBeGreaterThan(0);
      expect(secondPage.length).toBeGreaterThan(0);
    });

    test("queries with sortBy ascending", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        orderBy: { price: "ASC" },
        limit: 3,
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with sortBy descending", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        orderBy: { price: "DESC" },
        limit: 3,
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with noContent returns only keys", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        select: {},
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with returnFields", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        select: { category: true },
        highlight: { fields: [] },
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $ to return full document", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { name: { $eq: "Laptop" } },
      });

      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe("SearchIndex.query (json)", () => {
  const name = `test-query-json-${randomID().slice(0, 8)}`;
  const prefix = `${name}:`;
  const keys: string[] = [];

  const schema = s.object({
    name: s.string(),
    description: s.string(),
    category: s.string().noTokenize(),
    price: s.number(),
    stock: s.number("U64"),
    active: s.boolean(),
  });

  beforeAll(async () => {
    // Create the index
    const index = await createIndex(client, {
      name,
      schema,
      dataType: "json",
      prefix,
    });

    // Add test data
    const testData = [
      {
        name: "Laptop Pro",
        description: "High performance laptop",
        category: "electronics",
        price: 1299.99,
        stock: 50,
        active: true,
      },
      {
        name: "Laptop Basic",
        description: "Budget friendly laptop",
        category: "electronics",
        price: 599.99,
        stock: 100,
        active: true,
      },
      {
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse",
        category: "electronics",
        price: 29.99,
        stock: 200,
        active: true,
      },
      {
        name: "USB Cable",
        description: "Fast charging USB cable",
        category: "accessories",
        price: 9.99,
        stock: 500,
        active: true,
      },
      {
        name: "Phone Case",
        description: "Protective phone case",
        category: "accessories",
        price: 19.99,
        stock: 300,
        active: false,
      },
      {
        name: "Headphones",
        description: "Noise cancelling headphones",
        category: "audio",
        price: 199.99,
        stock: 75,
        active: true,
      },
      {
        name: "Keyboard",
        description: "Mechanical gaming keyboard",
        category: "electronics",
        price: 149.99,
        stock: 60,
        active: true,
      },
      {
        name: "Monitor",
        description: "4K Ultra HD monitor",
        category: "electronics",
        price: 449.99,
        stock: 30,
        active: true,
      },
    ];

    for (const [i, testDatum] of testData.entries()) {
      const key = `${prefix}${i}`;
      keys.push(key);
      await new JsonSetCommand([key, "$", testDatum]).exec(client);
    }

    await index.waitIndexing();
  });

  afterAll(async () => {
    // Cleanup
    const index = getIndex(client, name, schema);
    try {
      await index.drop();
    } catch {
      // Ignore
    }
    if (keys.length > 0) {
      await new DelCommand(keys).exec(client);
    }
  });

  describe("text field queries", () => {
    test("queries with $eq on text field", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({ filter: { name: { $eq: "Laptop" } } });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $fuzzy for typo tolerance", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { name: { $fuzzy: { $value: "Laptopp", $distance: 2 } } },
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $phrase for exact phrase matching", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { description: { $phrase: "wireless mouse" } },
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $regex pattern", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { name: { $regex: "Laptop.*" } },
      });

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("numeric field queries", () => {
    test("queries with $gt on numeric field", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({ filter: { price: { $gt: 500 } } });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $gte on numeric field", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({ filter: { stock: { $gte: 100 } } });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $lt on numeric field", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({ filter: { price: { $lt: 50 } } });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $lte on numeric field", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { stock: { $lte: 50 } },
      });

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("boolean field queries", () => {
    test("queries with $eq on boolean field", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({ filter: { active: { $eq: false } } });

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("query options", () => {
    test("queries with limit option", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({ filter: { category: { $eq: "electronics" } }, limit: 2 });

      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(2);
    });

    test("queries with offset for pagination", async () => {
      const index = getIndex(client, name, schema);
      const firstPage = await index.query({
        filter: { category: { $eq: "electronics" } },
        limit: 2,
        offset: 0,
      });

      const secondPage = await index.query({
        filter: { category: { $eq: "electronics" } },
        limit: 2,
        offset: 2,
      });

      expect(firstPage.length).toBeGreaterThan(0);
      expect(secondPage.length).toBeGreaterThan(0);
    });

    test("queries with sortBy ascending", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        orderBy: { price: "ASC" },
        limit: 3,
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with sortBy descending", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        orderBy: { price: "DESC" },
        limit: 3,
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with noContent returns only keys", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        select: {},
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with returnFields", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        select: { category: true },
        highlight: { fields: [] },
      });

      expect(result.length).toBeGreaterThan(0);
    });

    test("queries with $ to return full document", async () => {
      const index = getIndex(client, name, schema);
      const result = await index.query({
        filter: { name: { $eq: "Laptop" } },
      });

      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe("SearchIndex.count", () => {
  const name = `test-count-${randomID().slice(0, 8)}`;
  const prefix = `${name}:`;
  const keys: string[] = [];

  const schema = s.object({
    type: s.string(),
    value: s.number("U64"),
  });

  beforeAll(async () => {
    const index = await createIndex(client, {
      name,
      schema,
      dataType: "string",
      prefix,
    });

    // Add test data
    for (let i = 0; i < 10; i++) {
      const key = `${prefix}${i}`;
      keys.push(key);
      await new SetCommand([key, JSON.stringify({ type: i < 5 ? "A" : "B", value: i })]).exec(
        client
      );
    }

    await index.waitIndexing();
  });

  afterAll(async () => {
    const index = getIndex(client, name, schema);
    try {
      await index.drop();
    } catch {
      // Ignore
    }
    if (keys.length > 0) {
      await new DelCommand(keys).exec(client);
    }
  });

  test("counts matching documents", async () => {
    const index = getIndex(client, name, schema);
    const result = await index.count({ filter: { type: { $eq: "A" } } });

    expect(result.count).toBeGreaterThan(0);
  });

  test("counts with numeric filter", async () => {
    const index = getIndex(client, name, schema);
    const result = await index.count({ filter: { value: { $gte: 5 } } });

    expect(result.count).toBeGreaterThan(0);
  });
});

describe("SearchIndex.describe", () => {
  const name = `test-describe-${randomID().slice(0, 8)}`;

  const schema = s.object({
    title: s.string().noStem(),
    count: s.number("U64"),
    active: s.boolean(),
  });

  beforeAll(async () => {
    await createIndex(client, {
      name,
      schema,
      dataType: "string",
      prefix: `${name}:`,
    });
  });

  afterAll(async () => {
    const index = getIndex(client, name, schema);
    try {
      await index.drop();
    } catch {
      // Ignore
    }
  });

  test("describes the index structure", async () => {
    const index = getIndex(client, name, schema);
    const description = await index.describe();

    expect(description).toBeDefined();
  });

  test("describe non-existing", async () => {
    const index = getIndex(client, "non-existing", schema);
    const description = await index.describe();

    expect(description).toBeDefined();
  });
});

describe("SearchIndex.drop", () => {
  test("drops an existing index", async () => {
    const name = `test-drop-${randomID().slice(0, 8)}`;

    const schema = s.object({
      name: s.string(),
    });

    const index = await createIndex(client, {
      name,
      schema,
      dataType: "string",
      prefix: `${name}:`,
    });

    const result = await index.drop();
    expect(result).toBeDefined();
  });
});

describe("Hash index queries", () => {
  const name = `test-hash-query-${randomID().slice(0, 8)}`;
  const prefix = `${name}:`;
  const keys: string[] = [];

  const schema = s.object({
    name: s.string(),
    score: s.number("U64"),
  });

  beforeAll(async () => {
    const index = await createIndex(client, {
      name,
      schema,
      dataType: "hash",
      prefix,
    });

    // Add test data using HSET
    const testData = [
      { name: "Alice", score: "95" },
      { name: "Bob", score: "87" },
      { name: "Charlie", score: "92" },
    ];

    for (const [i, testDatum] of testData.entries()) {
      const key = `${prefix}${i}`;
      keys.push(key);
      await new HSetCommand([key, testDatum]).exec(client);
    }

    await index.waitIndexing();
  });

  afterAll(async () => {
    const index = getIndex(client, name, schema);
    try {
      await index.drop();
    } catch {
      // Ignore
    }
    if (keys.length > 0) {
      await new DelCommand(keys).exec(client);
    }
  });

  test("queries hash index by text field", async () => {
    const index = getIndex(client, name, schema);
    const result = await index.query({ filter: { name: { $eq: "Alice" } } });

    expect(result.length).toBeGreaterThan(0);
  });

  test("queries hash index with sorting", async () => {
    const index = getIndex(client, name, schema);
    const result = await index.query({
      filter: { score: { $gte: 80 } },
      orderBy: { score: "DESC" },
    });

    expect(result.length).toBeGreaterThan(0);
  });
});

describe("Nested string index queries", () => {
  const name = `test-nested-string-query-${randomID().slice(0, 8)}`;
  const prefix = `${name}:`;
  const keys: string[] = [];

  const schema = s.object({
    title: s.string(),
    author: s.object({
      name: s.string(),
      email: s.string(),
    }),
    stats: s.object({
      views: s.number("U64"),
      likes: s.number("U64"),
    }),
  });

  beforeAll(async () => {
    const index = await createIndex(client, {
      name,
      schema,
      dataType: "string",
      prefix,
    });

    const testData = [
      {
        title: "First Post",
        author: { name: "John Doe", email: "john@example.com" },
        stats: { views: 1000, likes: 50 },
      },
      {
        title: "Second Post",
        author: { name: "Jane Smith", email: "jane@example.com" },
        stats: { views: 500, likes: 30 },
      },
      {
        title: "Third Post",
        author: { name: "John Doe", email: "john@example.com" },
        stats: { views: 2000, likes: 100 },
      },
    ];

    for (const [i, testDatum] of testData.entries()) {
      const key = `${prefix}${i}`;
      keys.push(key);
      await new SetCommand([key, JSON.stringify(testDatum)]).exec(client);
    }

    await index.waitIndexing();
  });

  afterAll(async () => {
    const index = getIndex(client, name, schema);
    try {
      await index.drop();
    } catch {
      // Ignore
    }
    if (keys.length > 0) {
      await new DelCommand(keys).exec(client);
    }
  });

  test("queries nested text field", async () => {
    const index = getIndex(client, name, schema);
    const result = await index.query({ filter: { "author.name": { $eq: "John" } } });

    expect(result.length).toBeGreaterThan(0);
  });

  test("queries nested numeric field", async () => {
    const index = getIndex(client, name, schema);
    const result = await index.query({ filter: { "stats.views": { $gte: 1000 } } });

    expect(result.length).toBeGreaterThan(0);
  });

  test("queries with sorting on nested field", async () => {
    const index = getIndex(client, name, schema);
    const result = await index.query({
      filter: { "author.name": { $eq: "John" } },
      select: { "author.email": true },
      orderBy: { "stats.views": "DESC" },
    });

    expect(result.length).toBeGreaterThan(0);
  });
});

describe("Nested json index queries", () => {
  const name = `test-nested-json-query-${randomID().slice(0, 8)}`;
  const prefix = `${name}:`;
  const keys: string[] = [];

  const schema = s.object({
    title: s.string(),
    author: s.object({
      name: s.string(),
      email: s.string(),
    }),
    stats: s.object({
      views: s.number("U64"),
      likes: s.number("U64"),
    }),
  });

  beforeAll(async () => {
    const index = await createIndex(client, {
      name,
      schema,
      dataType: "json",
      prefix,
    });

    const testData = [
      {
        title: "First Post",
        author: { name: "John Doe", email: "john@example.com" },
        stats: { views: 1000, likes: 50 },
      },
      {
        title: "Second Post",
        author: { name: "Jane Smith", email: "jane@example.com" },
        stats: { views: 500, likes: 30 },
      },
      {
        title: "Third Post",
        author: { name: "John Doe", email: "john@example.com" },
        stats: { views: 2000, likes: 100 },
      },
    ];

    for (const [i, testDatum] of testData.entries()) {
      const key = `${prefix}${i}`;
      keys.push(key);
      await new JsonSetCommand([key, "$", testDatum]).exec(client);
    }

    await index.waitIndexing();
  });

  afterAll(async () => {
    const index = getIndex(client, name, schema);
    try {
      await index.drop();
    } catch {
      // Ignore
    }
    if (keys.length > 0) {
      await new DelCommand(keys).exec(client);
    }
  });

  test("queries nested text field", async () => {
    const index = getIndex(client, name, schema);
    const result = await index.query({ filter: { "author.name": { $eq: "John" } } });

    expect(result.length).toBeGreaterThan(0);
  });

  test("queries nested numeric field", async () => {
    const index = getIndex(client, name, schema);
    const result = await index.query({ filter: { "stats.views": { $gte: 1000 } } });

    expect(result.length).toBeGreaterThan(0);
  });

  test("queries with sorting on nested field", async () => {
    const index = getIndex(client, name, schema);
    const result = await index.query({
      filter: { "author.name": { $eq: "John" } },
      select: { "author.email": true },
      orderBy: { "stats.views": "DESC" },
    });

    expect(result.length).toBeGreaterThan(0);
  });
});

describe("index", () => {
  test("creates a SearchIndex instance without schema", () => {
    const index = getIndex(client, "test-index");

    expect(index).toBeInstanceOf(SearchIndex);
    expect(index.name).toBe("test-index");
    expect(index.schema).toBeUndefined();
  });

  test("creates a SearchIndex instance with schema", () => {
    const schema = s.object({
      name: s.string(),
      age: s.number("U64"),
    });

    const index = getIndex(client, "test-index", schema);

    expect(index).toBeInstanceOf(SearchIndex);
    expect(index.name).toBe("test-index");
    expect(index.schema).toEqual(schema);
  });
});
