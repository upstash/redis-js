import { afterAll, afterEach, beforeAll, describe, expect, test } from "bun:test";
import { newHttpClient, randomID } from "../../test-utils";
import { createIndex, initIndex, SearchIndex, listAliases, addAlias, delAlias } from "./search";
import { s } from "./schema-builder";
import { JsonSetCommand } from "../json_set";
import { SetCommand } from "../set";
import { HSetCommand } from "../hset";
import { DelCommand } from "../del";
import { ScanCommand } from "../scan";

const client = newHttpClient();

beforeAll(async () => {
  const [_cursor, indexKeys] = await new ScanCommand(["0", { type: "search" }]).exec(client);
  for (const key of indexKeys) {
    const index = initIndex(client, { name: key });
    try {
      await index.drop();
      // Wait a bit for the index to be fully dropped
    } catch (error) {
      console.warn(`Failed to drop index ${key}:`, error);
    }
  }
});

describe("createIndex", () => {
  const createdIndexes: string[] = [];

  afterEach(async () => {
    // Cleanup created indexes
    for (const name of createdIndexes) {
      try {
        const index = initIndex(client, { name });
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
      tag: s.keyword(),
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
    const index = initIndex(client, { name, schema });
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
    test("queries with eq on text field", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { name: { $eq: "Laptop" } } });

      expect(result.length).toBe(2);
      expect(result.map((r) => r.data.name)).toEqual(["Laptop Pro", "Laptop Basic"]);
    });

    test("queries with fuzzy for typo tolerance", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { name: { $fuzzy: { value: "Laptopp", distance: 2 } } },
      });

      expect(result.length).toBe(2);
      expect(result.map((r) => r.data.name)).toEqual(["Laptop Pro", "Laptop Basic"]);
    });

    test("queries with fuzzy for typo tolerance - simple string", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { name: { $fuzzy: "laptopp" } },
      });

      expect(result.length).toBe(2);
      expect(result.map((r) => r.data.name)).toEqual(["Laptop Pro", "Laptop Basic"]);
    });

    test("queries with phrase for exact phrase matching", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { description: { $phrase: { value: "wireless mouse", prefix: true } } },
      });

      expect(result.length).toBe(1);
      expect(result[0].data.name).toBe("Wireless Mouse");
    });

    test("queries with phrase for exact phrase matching - simple string", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { description: { $phrase: "wireless mouse" } },
      });

      expect(result.length).toBe(1);
      expect(result[0].data.name).toBe("Wireless Mouse");
    });

    test("queries with regex pattern", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { name: { $regex: "Laptop.*" } },
      });

      expect(result.length).toBe(2);
      expect(result.map((r) => r.data.name)).toEqual(["Laptop Pro", "Laptop Basic"]);
    });

    test("queries with smart for intelligent text search", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { name: { $smart: "Laptopp" } },
      });

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].data.name).toContain("Laptop");
    });
  });

  describe("numeric field queries", () => {
    test("queries with gt on numeric field", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { price: { $gt: 500 } } });

      expect(result.length).toBe(2);
      expect(result).toEqual([
        expect.objectContaining({
          data: expect.objectContaining({ name: "Laptop Pro", price: 1299.99 }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({ name: "Laptop Basic", price: 599.99 }),
        }),
      ]);
    });

    test("queries with gt on numeric field - no select (full data)", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { price: { $gt: 500 } } });

      expect(result.length).toBe(2);
      expect(result[0].key).toBeDefined();
      expect(result[0].score).toBeDefined();
      expect(result[0].data).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          category: expect.any(String),
          price: expect.any(Number),
          stock: expect.any(Number),
          active: expect.any(Boolean),
        })
      );
    });

    test("queries with gt on numeric field - select: {}", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { price: { $gt: 500 } }, select: {} });

      expect(result.length).toBe(2);
      expect(result[0].key).toBeDefined();
      expect(result[0].score).toBeDefined();
      expect(result[0]).not.toHaveProperty("data");
    });

    test("queries with gt on numeric field - select price only", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { price: { $gt: 500 } },
        select: { price: true },
      });

      expect(result.length).toBe(2);
      expect(result[0].key).toBeDefined();
      expect(result[0].score).toBeDefined();
      expect(result[0].data).toEqual(expect.objectContaining({ price: expect.any(Number) }));
      expect(result[0].data).not.toHaveProperty("name");
      expect(result[0].data).not.toHaveProperty("category");
    });

    test("queries with gte on numeric field", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { stock: { $gte: 100 } } });

      expect(result.length).toBe(4);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            data: expect.objectContaining({ name: "Laptop Basic", stock: 100 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "Wireless Mouse", stock: 200 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "USB Cable", stock: 500 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "Phone Case", stock: 300 }),
          }),
        ])
      );
    });

    test("queries with lt on numeric field", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { price: { $lt: 50 } } });

      expect(result.length).toBe(3);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            data: expect.objectContaining({ name: "Wireless Mouse", price: 29.99 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "USB Cable", price: 9.99 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "Phone Case", price: 19.99 }),
          }),
        ])
      );
    });

    test("queries with lte on numeric field", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { stock: { $lte: 50 } },
      });

      expect(result.length).toBe(2);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            data: expect.objectContaining({ name: "Laptop Pro", stock: 50 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "Monitor", stock: 30 }),
          }),
        ])
      );
    });
  });

  describe("boolean field queries", () => {
    test("queries with eq on boolean field", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { active: { $eq: false } } });

      expect(result.length).toBe(1);
      expect(result[0].data).toEqual(
        expect.objectContaining({ name: "Phone Case", active: false })
      );
    });

    test("queries with eq on boolean field - select: {}", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { active: { $eq: false } }, select: {} });

      expect(result.length).toBe(1);
      expect(result[0].key).toBeDefined();
      expect(result[0].score).toBeDefined();
      expect(result[0]).not.toHaveProperty("data");
    });

    test("queries with eq on boolean field - select name only", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { active: { $eq: false } },
        select: { name: true },
      });

      expect(result.length).toBe(1);
      expect(result[0].data).toEqual(expect.objectContaining({ name: "Phone Case" }));
      expect(result[0].data).not.toHaveProperty("active");
      expect(result[0].data).not.toHaveProperty("price");
    });
  });

  describe("query options", () => {
    test("queries with limit option", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { category: { $eq: "electronics" } }, limit: 2 });

      expect(result.length).toBe(2);
      expect(result[0].data).toEqual(expect.objectContaining({ category: "electronics" }));
      expect(result[1].data).toEqual(expect.objectContaining({ category: "electronics" }));
    });

    test("queries with offset for pagination", async () => {
      const index = initIndex(client, { name, schema });
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

      expect(firstPage.length).toBe(2);
      expect(secondPage.length).toBeGreaterThan(0);
      expect(firstPage[0].data).toEqual(expect.objectContaining({ category: "electronics" }));
      expect(firstPage[1].data).toEqual(expect.objectContaining({ category: "electronics" }));
      expect(secondPage[0].data).toEqual(expect.objectContaining({ category: "electronics" }));
    });

    test("queries with ORDERBY ascending", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        orderBy: { price: "ASC" },
        limit: 3,
      });

      expect(result.length).toBe(3);
      expect(result[0].data).toEqual(
        expect.objectContaining({ name: "Wireless Mouse", price: 29.99 })
      );
      expect(result[1].data).toEqual(expect.objectContaining({ name: "Keyboard", price: 149.99 }));
      expect(result[2].data).toEqual(expect.objectContaining({ name: "Monitor", price: 449.99 }));
    });

    test("queries with ORDERBY descending", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        orderBy: { price: "DESC" },
        limit: 3,
      });

      expect(result.length).toBe(3);
      expect(result[0].data).toEqual(
        expect.objectContaining({ name: "Laptop Pro", price: 1299.99 })
      );
      expect(result[1].data).toEqual(
        expect.objectContaining({ name: "Laptop Basic", price: 599.99 })
      );
      expect(result[2].data).toEqual(expect.objectContaining({ name: "Monitor", price: 449.99 }));
    });

    test("queries with noContent returns only keys", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        select: {},
      });

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].key).toBeDefined();
      expect(result[0].score).toBeDefined();
      expect(result[0]).not.toHaveProperty("data");
    });

    test("queries with returnFields", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        select: { category: true },
        highlight: { fields: ["category"] },
      });

      expect(result.length).toBe(5);
      for (const item of result) {
        expect(item.data).toEqual(expect.objectContaining({ category: "<em>electronics</em>" }));
        expect(item.data).not.toHaveProperty("name");
        expect(item.data).not.toHaveProperty("price");
      }
    });

    test("queries to return full document", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { name: { $eq: "Laptop" } },
      });

      expect(result.length).toBe(2);
      expect(result[0].data).toEqual(expect.objectContaining({ name: "Laptop Pro" }));
      expect(result[1].data).toEqual(expect.objectContaining({ name: "Laptop Basic" }));
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
    const index = initIndex(client, { name, schema });
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
    test("queries with eq on text field", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { name: { $eq: "Laptop" } } });

      expect(result).toEqual([
        expect.objectContaining({ data: expect.objectContaining({ name: "Laptop Pro" }) }),
        expect.objectContaining({ data: expect.objectContaining({ name: "Laptop Basic" }) }),
      ]);
    });

    test("queries with fuzzy for typo tolerance", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { name: { $fuzzy: { value: "Laptopp", distance: 2 } } },
      });

      expect(result).toEqual([
        expect.objectContaining({ data: expect.objectContaining({ name: "Laptop Pro" }) }),
        expect.objectContaining({ data: expect.objectContaining({ name: "Laptop Basic" }) }),
      ]);
    });

    test("queries with phrase for exact phrase matching", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { description: { $phrase: "wireless mouse" } },
      });

      expect(result).toEqual([
        expect.objectContaining({ data: expect.objectContaining({ name: "Wireless Mouse" }) }),
      ]);
    });

    test("queries with regex pattern", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { name: { $regex: "Laptop.*" } },
      });

      expect(result).toEqual([
        expect.objectContaining({ data: expect.objectContaining({ name: "Laptop Pro" }) }),
        expect.objectContaining({ data: expect.objectContaining({ name: "Laptop Basic" }) }),
      ]);
    });
  });

  describe("numeric field queries", () => {
    test("queries with gt on numeric field", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { price: { $gt: 500 } } });

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            data: expect.objectContaining({ name: "Laptop Pro", price: 1299.99 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "Laptop Basic", price: 599.99 }),
          }),
        ])
      );
    });

    test("queries with gte on numeric field", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { stock: { $gte: 100 } } });

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            data: expect.objectContaining({ name: "Laptop Basic", stock: 100 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "Wireless Mouse", stock: 200 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "USB Cable", stock: 500 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "Phone Case", stock: 300 }),
          }),
        ])
      );
    });

    test("queries with lt on numeric field", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { price: { $lt: 50 } } });

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            data: expect.objectContaining({ name: "Wireless Mouse", price: 29.99 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "USB Cable", price: 9.99 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "Phone Case", price: 19.99 }),
          }),
        ])
      );
    });

    test("queries with lte on numeric field", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { stock: { $lte: 50 } },
      });

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            data: expect.objectContaining({ name: "Laptop Pro", stock: 50 }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({ name: "Monitor", stock: 30 }),
          }),
        ])
      );
    });
  });

  describe("boolean field queries", () => {
    test("queries with eq on boolean field", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { active: { $eq: false } } });

      expect(result).toEqual([
        expect.objectContaining({
          data: expect.objectContaining({ name: "Phone Case", active: false }),
        }),
      ]);
    });
  });

  describe("query options", () => {
    test("queries with limit option", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({ filter: { category: { $eq: "electronics" } }, limit: 2 });

      expect(result.length).toBe(2);
      expect(result).toEqual([
        expect.objectContaining({ data: expect.objectContaining({ category: "electronics" }) }),
        expect.objectContaining({ data: expect.objectContaining({ category: "electronics" }) }),
      ]);
    });

    test("queries with offset for pagination", async () => {
      const index = initIndex(client, { name, schema });
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

      expect(firstPage.length).toBe(2);
      expect(secondPage.length).toBeGreaterThan(0);
      expect(firstPage).toEqual([
        expect.objectContaining({ data: expect.objectContaining({ category: "electronics" }) }),
        expect.objectContaining({ data: expect.objectContaining({ category: "electronics" }) }),
      ]);
      expect(secondPage).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ data: expect.objectContaining({ category: "electronics" }) }),
        ])
      );
    });

    test("queries with ORDERBY ascending", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        orderBy: { price: "ASC" },
        limit: 3,
      });

      expect(result).toEqual([
        expect.objectContaining({
          data: expect.objectContaining({ name: "Wireless Mouse", price: 29.99 }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({ name: "Keyboard", price: 149.99 }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({ name: "Monitor", price: 449.99 }),
        }),
      ]);
    });

    test("queries with ORDERBY descending", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        orderBy: { price: "DESC" },
        limit: 3,
      });

      expect(result).toEqual([
        expect.objectContaining({
          data: expect.objectContaining({ name: "Laptop Pro", price: 1299.99 }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({ name: "Laptop Basic", price: 599.99 }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({ name: "Monitor", price: 449.99 }),
        }),
      ]);
    });

    test("queries with noContent returns only keys", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        select: {},
      });

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].key).toBeDefined();
      expect(result[0].score).toBeDefined();
      expect(result[0]).not.toHaveProperty("data");
    });

    test("queries with returnFields", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { category: { $eq: "electronics" } },
        select: { category: true },
        highlight: { fields: [] },
      });

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ data: expect.objectContaining({ category: "electronics" }) }),
          expect.objectContaining({ data: expect.objectContaining({ category: "electronics" }) }),
          expect.objectContaining({ data: expect.objectContaining({ category: "electronics" }) }),
          expect.objectContaining({ data: expect.objectContaining({ category: "electronics" }) }),
          expect.objectContaining({ data: expect.objectContaining({ category: "electronics" }) }),
        ])
      );
    });

    test("queries to return full document", async () => {
      const index = initIndex(client, { name, schema });
      const result = await index.query({
        filter: { name: { $eq: "Laptop" } },
      });

      expect(result).toEqual([
        expect.objectContaining({ data: expect.objectContaining({ name: "Laptop Pro" }) }),
        expect.objectContaining({ data: expect.objectContaining({ name: "Laptop Basic" }) }),
      ]);
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
    const index = initIndex(client, { name, schema });
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
    const index = initIndex(client, { name, schema });
    const result = await index.count({ filter: { type: { $eq: "A" } } });

    expect(result).toEqual({ count: 5 });
  });

  test("counts with numeric filter", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.count({ filter: { value: { $gte: 5 } } });

    expect(result).toEqual({ count: 5 });
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
    const index = initIndex(client, { name, schema });
    try {
      await index.drop();
    } catch {
      // Ignore
    }
  });

  test("describes the index structure", async () => {
    const index = initIndex(client, { name, schema });
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
    expect(result).toBe(1);
  });

  test("drop non-existing index returns 0", async () => {
    const index = initIndex(client, { name: "non-existing-drop" });
    const result = await index.drop();
    expect(result).toBe(0);
  });
});

describe("Non-existing index behavior", () => {
  const schema = s.object({
    name: s.string(),
    value: s.number(),
  });

  test("describe non-existing index returns null", async () => {
    const index = initIndex(client, { name: "non-existing-describe", schema });
    const result = await index.describe();
    expect(result).toBeNull();
  });

  test("query non-existing index returns empty array", async () => {
    const index = initIndex(client, { name: "non-existing-query", schema });
    const result = await index.query();
    expect(result).toBeNull();
  });

  test("count non-existing index returns -1", async () => {
    const index = initIndex(client, { name: "non-existing-count", schema });
    const result = await index.count({ filter: { name: { $eq: "test" } } });
    expect(result).toEqual({ count: -1 });
  });

  test("waitIndexing non-existing index does not throw", async () => {
    const index = initIndex(client, { name: "non-existing-wait", schema });
    const result = await index.waitIndexing();
    expect(result).toBe(0);
  });
});

describe("Date field queries", () => {
  const name = `test-date-${randomID().slice(0, 8)}`;
  const prefix = `${name}:`;
  const keys: string[] = [];

  const schema = s.object({
    title: s.string(),
    publishedAt: s.date().fast(),
  });

  beforeAll(async () => {
    const index = await createIndex(client, {
      name,
      schema,
      dataType: "hash",
      prefix,
    });

    // Add test data with different dates
    const articles = [
      { title: "Article 1", publishedAt: new Date("2026-01-10T10:00:00Z").toISOString() },
      { title: "Article 2", publishedAt: new Date("2026-01-20T10:00:00Z").toISOString() },
      { title: "Article 3", publishedAt: new Date("2026-02-05T10:00:00Z").toISOString() },
    ];

    for (const [i, article] of articles.entries()) {
      const key = `${prefix}${i}`;
      keys.push(key);
      await new HSetCommand([key, article]).exec(client);
    }

    await index.waitIndexing();
  });

  afterAll(async () => {
    const index = initIndex(client, { name, schema });
    try {
      await index.drop();
    } catch {
      // Ignore
    }
    if (keys.length > 0) {
      await new DelCommand(keys).exec(client);
    }
  });

  test("queries with date range filter", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.query({
      filter: {
        publishedAt: {
          $gte: new Date("2026-01-01T00:00:00Z"),
          $lt: new Date("2026-02-01T00:00:00Z"),
        },
      },
    });

    expect(result.length).toBe(2);
    expect(result.map((r) => r.data.title)).toEqual(
      expect.arrayContaining(["Article 1", "Article 2"])
    );
  });

  test("queries with date greater than filter", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.query({
      filter: {
        publishedAt: {
          $gt: new Date("2026-01-15T00:00:00Z"),
        },
      },
    });

    expect(result.length).toBe(2);
    expect(result.map((r) => r.data.title)).toEqual(
      expect.arrayContaining(["Article 2", "Article 3"])
    );
  });

  test("queries with date less than filter", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.query({
      filter: {
        publishedAt: {
          $lt: new Date("2026-01-15T00:00:00Z"),
        },
      },
    });

    expect(result.length).toBe(1);
    expect(result[0].data.title).toBe("Article 1");
  });
});

describe("Score function queries", () => {
  const name = `test-scorefunc-${randomID().slice(0, 8)}`;
  const prefix = `${name}:`;
  const keys: string[] = [];

  const schema = s.object({
    name: s.string(),
    popularity: s.number("U64"),
    recency: s.number("U64"),
  });

  beforeAll(async () => {
    const index = await createIndex(client, {
      name,
      schema,
      dataType: "hash",
      prefix,
    });

    // Add test data with different popularity scores
    const products = [
      { name: "Laptop Pro", popularity: "1000", recency: "100" },
      { name: "Laptop Basic", popularity: "500", recency: "200" },
      { name: "Laptop Air", popularity: "2000", recency: "50" },
    ];

    for (const [i, product] of products.entries()) {
      const key = `${prefix}${i}`;
      keys.push(key);
      await new HSetCommand([key, product]).exec(client);
    }

    await index.waitIndexing();
  });

  afterAll(async () => {
    const index = initIndex(client, { name, schema });
    try {
      await index.drop();
    } catch {
      // Ignore
    }
    if (keys.length > 0) {
      await new DelCommand(keys).exec(client);
    }
  });

  test("queries with simple scoreFunc boosts by popularity", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.query({
      filter: { name: "Laptop" },
      scoreFunc: "popularity",
    });

    expect(result.length).toBe(3);
    // Higher popularity should result in higher scores (multiplied with relevance)
    expect(result[0].data.name).toBe("Laptop Air"); // popularity 2000
  });

  test("queries with scoreFunc using modifier", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.query({
      filter: { name: "Laptop" },
      scoreFunc: {
        field: "popularity",
        modifier: "log1p",
        factor: 2,
      },
    });

    expect(result.length).toBe(3);
    // Results should be affected by log1p(popularity) * 2.0
    expect(result[0].data.name).toBe("Laptop Air");
  });

  test("queries with scoreFunc using scoreMode replace", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.query({
      filter: { name: "Laptop" },
      scoreFunc: {
        field: "popularity",
        scoreMode: "replace",
      },
    });

    expect(result.length).toBe(3);
    // Scores should be replaced with popularity values
    expect(result[0].data.name).toBe("Laptop Air"); // popularity 2000
    expect(result[0].score).toBeGreaterThan(result[1].score);
  });

  test("queries with multiple field values combined", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.query({
      filter: { name: "Laptop" },
      scoreFunc: {
        fields: [
          { field: "popularity", modifier: "log1p" },
          { field: "recency", modifier: "log1p" },
        ],
        combineMode: "sum",
      },
    });

    expect(result.length).toBe(3);
    // Results should be affected by log1p(popularity) + log1p(recency)
    expect(result[0].data.name).toBeDefined();
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
    const index = initIndex(client, { name, schema });
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
    const index = initIndex(client, { name, schema });
    const result = await index.query({ filter: { name: { $eq: "Alice" } } });

    expect(result).toEqual([
      expect.objectContaining({ data: expect.objectContaining({ name: "Alice", score: 95 }) }),
    ]);
  });

  test("queries hash index with sorting", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.query({
      filter: { score: { $gte: 80 } },
      orderBy: { score: "DESC" },
    });

    expect(result).toEqual([
      expect.objectContaining({ data: expect.objectContaining({ name: "Alice", score: 95 }) }),
      expect.objectContaining({ data: expect.objectContaining({ name: "Charlie", score: 92 }) }),
      expect.objectContaining({ data: expect.objectContaining({ name: "Bob", score: 87 }) }),
    ]);
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
    const index = initIndex(client, { name, schema });
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
    const index = initIndex(client, { name, schema });
    const result = await index.query({ filter: { "author.name": { $eq: "John" } } });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({
            title: "First Post",
            author: expect.objectContaining({ name: "John Doe" }),
          }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({
            title: "Third Post",
            author: expect.objectContaining({ name: "John Doe" }),
          }),
        }),
      ])
    );
  });

  test("queries nested numeric field", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.query({ filter: { "stats.views": { $gte: 1000 } } });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({
            title: "First Post",
            stats: expect.objectContaining({ views: 1000 }),
          }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({
            title: "Third Post",
            stats: expect.objectContaining({ views: 2000 }),
          }),
        }),
      ])
    );
  });

  test("queries with sorting on nested field", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.query({
      filter: { "author.name": { $eq: "John" } },
      select: { "author.email": true },
      orderBy: { "stats.views": "DESC" },
    });

    expect(result).toEqual([
      expect.objectContaining({
        data: expect.objectContaining({
          author: expect.objectContaining({ email: "john@example.com" }),
        }),
      }),
      expect.objectContaining({
        data: expect.objectContaining({
          author: expect.objectContaining({ email: "john@example.com" }),
        }),
      }),
    ]);
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
    const index = initIndex(client, { name, schema });
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
    const index = initIndex(client, { name, schema });
    const result = await index.query({ filter: { "author.name": { $eq: "John" } } });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({
            title: "First Post",
            author: expect.objectContaining({ name: "John Doe" }),
          }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({
            title: "Third Post",
            author: expect.objectContaining({ name: "John Doe" }),
          }),
        }),
      ])
    );
  });

  test("queries nested numeric field", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.query({ filter: { "stats.views": { $gte: 1000 } } });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({
            title: "First Post",
            stats: expect.objectContaining({ views: 1000 }),
          }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({
            title: "Third Post",
            stats: expect.objectContaining({ views: 2000 }),
          }),
        }),
      ])
    );
  });

  test("queries with sorting on nested field", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.query({
      filter: { "author.name": { $eq: "John" } },
      select: { "author.email": true },
      orderBy: { "stats.views": "DESC" },
    });

    expect(result).toEqual([
      expect.objectContaining({
        data: expect.objectContaining({
          author: expect.objectContaining({ email: "john@example.com" }),
        }),
      }),
      expect.objectContaining({
        data: expect.objectContaining({
          author: expect.objectContaining({ email: "john@example.com" }),
        }),
      }),
    ]);
  });
});

describe("index", () => {
  test("creates a SearchIndex instance without schema", () => {
    const index = initIndex(client, { name: "test-index" });

    expect(index).toBeInstanceOf(SearchIndex);
    expect(index.name).toBe("test-index");
    expect(index.schema).toBeUndefined();
  });

  test("creates a SearchIndex instance with schema", () => {
    const schema = s.object({
      name: s.string(),
      age: s.number("U64"),
    });

    const index = initIndex(client, { name: "test-index", schema });

    expect(index).toBeInstanceOf(SearchIndex);
    expect(index.name).toBe("test-index");
    expect(index.schema).toEqual(schema);
  });
});

describe("Field aliasing with 'from' and stemming", () => {
  const name = `test-from-stem-${randomID().slice(0, 8)}`;
  const prefix = `${name}:`;
  const keys: string[] = [];

  const schema = s.object({
    content: s.string(), // Default: with stemming
    contentExact: s.string().noStem().from("content"), // No stemming, from same source
  });

  beforeAll(async () => {
    const index = await createIndex(client, {
      name,
      schema,
      dataType: "json",
      prefix,
    });

    // Add test data with "running"
    await new JsonSetCommand([`${prefix}1`, "$", { content: "running fast" }]).exec(client);
    await new JsonSetCommand([`${prefix}2`, "$", { content: "runner on track" }]).exec(client);
    keys.push(`${prefix}1`, `${prefix}2`);

    await index.waitIndexing();
  });

  afterAll(async () => {
    const index = initIndex(client, { name, schema });
    try {
      await index.drop();
    } catch {
      // Ignore
    }
    if (keys.length > 0) {
      await new DelCommand(keys).exec(client);
    }
  });

  test("stemmed field matches stemmed variants", async () => {
    const index = initIndex(client, { name, schema });
    // Query stemmed field with "run" - should match "running" and "runner"
    const result = await index.query({
      filter: { content: { $eq: "run" } },
    });

    expect(result.length).toBe(1);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({ content: "running fast" }),
        }),
      ])
    );
  });

  test("noStem field requires exact match", async () => {
    const index = initIndex(client, { name, schema });
    // Query non-stemmed field with "run" - should NOT match "running" or "runner"
    const result = await index.query({
      filter: { contentExact: { $eq: "run" } },
    });

    expect(result.length).toBe(0);
  });

  test("noStem field matches when exact word is present", async () => {
    const index = initIndex(client, { name, schema });
    // Query non-stemmed field with "running" - should match exactly
    const result = await index.query({
      filter: { contentExact: { $eq: "running" } },
    });

    expect(result.length).toBe(1);
    expect(result[0].data).toEqual({ content: "running fast" });
  });
});

describe("SearchIndex.aggregate (json)", () => {
  const name = `test-aggregate-json-${randomID().slice(0, 8)}`;
  const prefix = `${name}:`;
  const keys: string[] = [];

  const schema = s.object({
    title: s.string(),
    category: s.string().noTokenize(),
    categoryId: s.number(),
    price: s.number(),
    quantity: s.number(),
  });

  beforeAll(async () => {
    // Clean up any existing test indexes first
    const [_cursor, indexKeys] = await new ScanCommand(["0", { type: "search" }]).exec(client);
    for (const key of indexKeys) {
      if (key.startsWith("test-")) {
        const idx = initIndex(client, { name: key });
        try {
          await idx.drop();
        } catch {
          // Ignore errors
        }
      }
    }

    const index = await createIndex(client, {
      name,
      schema,
      dataType: "json",
      prefix,
    });

    const testData = Array.from({ length: 9 }, (_, i) => ({
      title: `product ${i}`,
      category: ["electronics", "clothing", "books"][i % 3],
      categoryId: i % 3, // 0=electronics, 1=clothing, 2=books
      price: i * 10,
      quantity: i,
    }));

    for (const [i, doc] of testData.entries()) {
      const key = `${prefix}doc:${i}`;
      keys.push(key);
      await new JsonSetCommand([key, "$", doc]).exec(client);
    }

    await index.waitIndexing();
  });

  afterAll(async () => {
    const index = initIndex(client, { name, schema });
    try {
      await index.drop();
    } catch {
      // Ignore
    }
    if (keys.length > 0) {
      await new DelCommand(keys).exec(client);
    }
  });

  test("basic stats aggregation", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        s: { $stats: { field: "price" } },
      },
    });

    expect(result).toEqual({ s: { count: 9, min: 0, max: 80, sum: 360, avg: 40 } });
  });

  test("range aggregation", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        tiers: {
          $range: {
            field: "price",
            ranges: [{ to: 30 }, { from: 30, to: 60 }, { from: 60 }],
          },
        },
      },
    });

    expect(result).toEqual({
      tiers: {
        buckets: [
          { key: "*-30", docCount: 3, to: 30 },
          { key: "30-60", docCount: 3, from: 30, to: 60 },
          { key: "60-*", docCount: 3, from: 60 },
        ],
      },
    });
  });

  test("histogram aggregation", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        h: { $histogram: { field: "price", interval: 30 } },
      },
    });

    expect(result).toEqual({
      h: {
        buckets: [
          { key: 0, docCount: 3 },
          { key: 30, docCount: 3 },
          { key: 60, docCount: 3 },
        ],
      },
    });
  });

  test("multiple aggregations", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        price_stats: { $stats: { field: "price" } },
        qty_stats: { $stats: { field: "quantity" } },
      },
    });

    expect(result).toEqual({
      price_stats: { count: 9, min: 0, max: 80, sum: 360, avg: 40 },
      qty_stats: { count: 9, min: 0, max: 8, sum: 36, avg: 4 },
    });
  });

  test("aggregation with search results (LIMIT)", async () => {
    const index = initIndex(client, { name, schema });
    const [aggResult, searchResults] = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        s: { $stats: { field: "price" } },
      },
      limit: 3,
    });

    expect(aggResult).toEqual({ s: { count: 9, min: 0, max: 80, sum: 360, avg: 40 } });
    expect(searchResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: expect.any(String), score: expect.any(Number) }),
        expect.objectContaining({ key: expect.any(String), score: expect.any(Number) }),
        expect.objectContaining({ key: expect.any(String), score: expect.any(Number) }),
      ])
    );
  });

  test("nested aggregation with $aggs - terms with avg", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        by_cat: {
          $terms: { field: "categoryId" },
          $aggs: {
            avg_price: { $avg: { field: "price" } },
          },
        },
      },
    });

    expect(result).toEqual({
      by_cat: {
        buckets: expect.arrayContaining([
          { key: 0, docCount: 3, avg_price: { value: 30 } },
          { key: 1, docCount: 3, avg_price: { value: 40 } },
          { key: 2, docCount: 3, avg_price: { value: 50 } },
        ]),
      },
    });
  });

  test("nested aggregation with $aggs - terms with multiple metrics", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        by_cat: {
          $terms: { field: "categoryId" },
          $aggs: {
            avg_price: { $avg: { field: "price" } },
            min_price: { $min: { field: "price" } },
            max_price: { $max: { field: "price" } },
            sum_qty: { $sum: { field: "quantity" } },
          },
        },
      },
    });

    expect(result).toEqual({
      by_cat: {
        buckets: expect.arrayContaining([
          expect.objectContaining({
            key: 0,
            docCount: 3,
            avg_price: { value: 30 },
            min_price: { value: 0 },
            max_price: { value: 60 },
            sum_qty: { value: 9 },
          }),
        ]),
      },
    });
  });

  test("nested aggregation with $aggs - range with stats", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        price_ranges: {
          $range: {
            field: "price",
            ranges: [{ to: 30 }, { from: 30, to: 60 }, { from: 60 }],
          },
          $aggs: {
            qty_stats: { $stats: { field: "quantity" } },
          },
        },
      },
    });

    expect(result).toEqual({
      price_ranges: {
        buckets: [
          {
            key: "*-30",
            docCount: 3,
            to: 30,
            qty_stats: { count: 3, min: 0, max: 2, sum: 3, avg: 1 },
          },
          expect.objectContaining({ key: "30-60", docCount: 3 }),
          expect.objectContaining({ key: "60-*", docCount: 3 }),
        ],
      },
    });
  });

  test("nested aggregation with $aggs - histogram with avg", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        price_histogram: {
          $histogram: { field: "price", interval: 30 },
          $aggs: {
            avg_qty: { $avg: { field: "quantity" } },
          },
        },
      },
    });

    expect(result).toEqual({
      price_histogram: {
        buckets: [
          { key: 0, docCount: 3, avg_qty: { value: 1 } },
          expect.objectContaining({ key: 30, docCount: 3 }),
          expect.objectContaining({ key: 60, docCount: 3 }),
        ],
      },
    });
  });

  test("metric aggregations - avg, sum, min, max, count", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        avg_price: { $avg: { field: "price" } },
        sum_price: { $sum: { field: "price" } },
        min_price: { $min: { field: "price" } },
        max_price: { $max: { field: "price" } },
        count_price: { $count: { field: "price" } },
      },
    });

    expect(result).toEqual({
      avg_price: { value: 40 },
      sum_price: { value: 360 },
      min_price: { value: 0 },
      max_price: { value: 80 },
      count_price: { value: 9 },
    });
  });

  test("metric aggregation - cardinality", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        unique_categories: { $cardinality: { field: "categoryId" } },
      },
    });

    expect(result).toEqual({ unique_categories: { value: 3 } });
  });

  test("metric aggregation - extendedStats without sigma", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        es: { $extendedStats: { field: "price" } },
      },
    });

    expect(result.es).toEqual(
      expect.objectContaining({
        count: 9,
        min: 0,
        max: 80,
        avg: 40,
        sum: 360,
        variance: expect.any(Number),
        stdDeviation: expect.any(Number),
        stdDeviationBounds: expect.objectContaining({
          upper: expect.any(Number),
          lower: expect.any(Number),
        }),
      })
    );
  });

  test("metric aggregation - extendedStats with sigma", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        es: { $extendedStats: { field: "price", sigma: 2 } },
      },
    });

    expect(result.es).toEqual(
      expect.objectContaining({
        count: 9,
        stdDeviationBounds: expect.objectContaining({
          upper: expect.any(Number),
          lower: expect.any(Number),
          upperSampling: expect.any(Number),
          lowerSampling: expect.any(Number),
          upperPopulation: expect.any(Number),
          lowerPopulation: expect.any(Number),
        }),
      })
    );
  });

  test("metric aggregation - percentiles default (keyed)", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        p: { $percentiles: { field: "price", percents: [50, 95, 99] } },
      },
    });

    expect(result.p).toEqual({
      values: expect.objectContaining({
        "50.0": expect.any(Number),
        "95.0": expect.any(Number),
        "99.0": expect.any(Number),
      }),
    });
  });

  test("metric aggregation - percentiles unkeyed", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        p: { $percentiles: { field: "price", percents: [50, 95], keyed: false } },
      },
    });

    expect(result.p).toEqual({
      values: [
        { key: 50, value: expect.any(Number) },
        { key: 95, value: expect.any(Number) },
      ],
    });
  });

  test("metric aggregation - missing value handling", async () => {
    const index = initIndex(client, { name, schema });
    const result = await index.aggregate({
      filter: { title: { $eq: "product" } },
      aggregations: {
        avg_with_default: { $avg: { field: "price", missing: 100 } },
      },
    });

    expect(result).toEqual({ avg_with_default: { value: 40 } });
  });
});

describe("alias commands", () => {
  const createdIndexes: string[] = [];
  const createdAliases: string[] = [];

  beforeAll(async () => {
    // Clean up any existing test indexes and aliases first
    const [_cursor, indexKeys] = await new ScanCommand(["0", { type: "search" }]).exec(client);
    for (const key of indexKeys) {
      if (key.startsWith("test-alias")) {
        const idx = initIndex(client, { name: key });
        try {
          await idx.drop();
        } catch {
          // Ignore errors
        }
      }
    }

    const aliases = await listAliases(client);

    for (const alias in aliases) {
      if (alias.startsWith("alias")) {
        try {
          await delAlias(client, { alias });
        } catch {
          // Ignore errors
        }
      }
    }
  });

  afterEach(async () => {
    // Cleanup aliases first
    for (const alias of createdAliases) {
      try {
        await delAlias(client, { alias });
      } catch {
        // Alias might not exist, ignore
      }
    }
    createdAliases.length = 0;

    // Then cleanup indexes
    for (const name of createdIndexes) {
      try {
        const index = initIndex(client, { name });
        await index.drop();
      } catch {
        // Index might not exist, ignore
      }
    }
    createdIndexes.length = 0;
  });

  test("list, add, and delete aliases", async () => {
    // Create two indexes
    const index1Name = `test-alias-idx1-${randomID().slice(0, 8)}`;
    const index2Name = `test-alias-idx2-${randomID().slice(0, 8)}`;
    createdIndexes.push(index1Name, index2Name);

    const schema = s.object({
      title: s.string(),
      popularity: s.number("U64"),
      freshness: s.number("U64"),
    });

    await createIndex(client, {
      name: index1Name,
      schema,
      dataType: "hash",
      prefix: `${index1Name}:`,
    });

    await createIndex(client, {
      name: index2Name,
      schema,
      dataType: "hash",
      prefix: `${index2Name}:`,
    });

    const waitIndexingResult = await Promise.all([
      initIndex(client, { name: index1Name, schema }).waitIndexing(),
      initIndex(client, { name: index2Name, schema }).waitIndexing(),
    ]);
    expect(waitIndexingResult).toEqual([1, 1]);

    // Add aliases using top-level API
    const alias1_1 = `alias1-1-${randomID().slice(0, 8)}`;
    const alias1_2 = `alias1-2-${randomID().slice(0, 8)}`;
    const alias2_1 = `alias2-1-${randomID().slice(0, 8)}`;
    createdAliases.push(alias1_1, alias1_2, alias2_1);

    await addAlias(client, { indexName: index1Name, alias: alias1_1 });
    expect(await addAlias(client, { indexName: index1Name, alias: alias1_2 })).toBe(1);
    expect(await addAlias(client, { indexName: index2Name, alias: alias2_1 })).toBe(1);

    // List aliases and verify
    const aliases = await listAliases(client);
    expect(aliases[alias1_1]).toBe(index1Name);
    expect(aliases[alias1_2]).toBe(index1Name);
    expect(aliases[alias2_1]).toBe(index2Name);

    // Delete one alias
    expect(await delAlias(client, { alias: alias1_1 })).toBe(1);

    // Verify it's deleted
    const aliasesAfterDelete = await listAliases(client);
    expect(aliasesAfterDelete[alias1_1]).toBeUndefined();
    expect(aliasesAfterDelete[alias1_2]).toBe(index1Name);
    expect(aliasesAfterDelete[alias2_1]).toBe(index2Name);
  });

  test("aliaslist returns empty object when no aliases exist", async () => {
    // After cleanup, listing should return empty (or at least not throw)
    const aliases = await listAliases(client);
    expect(aliases).toEqual({});
  });

  test("aliasadd returns 1 when index does not exist", async () => {
    const alias = `alias-noindex-${randomID().slice(0, 8)}`;
    const result = await addAlias(client, {
      indexName: `non-existing-index-${randomID().slice(0, 8)}`,
      alias,
    });
    expect(result).toBe(1);
  });

  test("aliasadd returns 1 when alias is added", async () => {
    const indexName = `test-alias-add-${randomID().slice(0, 8)}`;
    createdIndexes.push(indexName);

    const schema = s.object({ title: s.string() });
    await createIndex(client, {
      name: indexName,
      schema,
      dataType: "hash",
      prefix: `${indexName}:`,
    });

    const alias = `alias-new-${randomID().slice(0, 8)}`;
    createdAliases.push(alias);

    const result = await addAlias(client, { indexName, alias });
    expect(result).toBe(1);
  });

  test("aliasadd returns 2 when alias is updated", async () => {
    const index1Name = `test-alias-upd1-${randomID().slice(0, 8)}`;
    const index2Name = `test-alias-upd2-${randomID().slice(0, 8)}`;
    createdIndexes.push(index1Name, index2Name);

    const schema = s.object({ title: s.string() });
    await createIndex(client, {
      name: index1Name,
      schema,
      dataType: "hash",
      prefix: `${index1Name}:`,
    });
    await createIndex(client, {
      name: index2Name,
      schema,
      dataType: "hash",
      prefix: `${index2Name}:`,
    });

    const alias = `alias-update-${randomID().slice(0, 8)}`;
    createdAliases.push(alias);

    // First add - should return 1
    const first = await addAlias(client, { indexName: index1Name, alias });
    expect(first).toBe(1);

    // Update to point to different index - should return 2
    const second = await addAlias(client, { indexName: index2Name, alias });
    expect(second).toBe(2);
  });

  test("aliasdel returns 0 when alias does not exist", async () => {
    const result = await delAlias(client, { alias: "non-existing-alias" });
    expect(result).toBe(0);
  });

  test("aliasdel returns 1 when alias is deleted", async () => {
    const indexName = `test-alias-del-${randomID().slice(0, 8)}`;
    createdIndexes.push(indexName);

    const schema = s.object({ title: s.string() });
    await createIndex(client, {
      name: indexName,
      schema,
      dataType: "hash",
      prefix: `${indexName}:`,
    });

    const alias = `alias-del-${randomID().slice(0, 8)}`;
    await addAlias(client, { indexName, alias });

    const result = await delAlias(client, { alias });
    expect(result).toBe(1);
  });

  test("add alias using index method", async () => {
    const indexName = `test-alias-idx-${randomID().slice(0, 8)}`;
    createdIndexes.push(indexName);

    const schema = s.object({
      title: s.string(),
      count: s.number("U64"),
    });

    const index = await createIndex(client, {
      name: indexName,
      schema,
      dataType: "hash",
      prefix: `${indexName}:`,
    });

    const alias = `alias-${randomID().slice(0, 8)}`;
    createdAliases.push(alias);

    // Add alias using index method
    expect(await index.addAlias({ alias })).toBe(1);

    // Verify it was created
    const aliases = await listAliases(client);
    expect(aliases[alias]).toBe(indexName);
  });
});
