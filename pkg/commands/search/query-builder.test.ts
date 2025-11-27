import { describe, test, expect } from "bun:test";
import { buildQuery, buildQueryCommand, type QueryFilter } from "./query-builder";
import type { FlatIndexSchema, NestedIndexSchema } from "./types";

describe("Query Builder (JSON)", () => {
  describe("Simple field operations", () => {
    test("should build text equals query", () => {
      type Schema = FlatIndexSchema & { name: "TEXT"; age: "U64" };
      const filter: QueryFilter<Schema> = {
        name: { equals: "John" },
      };

      const query = buildQuery(filter);
      expect(query).toBe('{"name":"John"}');
    });

    test("should build numeric equals query", () => {
      type Schema = FlatIndexSchema & { age: "U64" };
      const filter: QueryFilter<Schema> = {
        age: { equals: 25 },
      };

      const query = buildQuery(filter);
      expect(query).toBe('{"age":25}');
    });

    test("should build boolean equals query", () => {
      type Schema = FlatIndexSchema & { active: "BOOL" };
      const filter: QueryFilter<Schema> = {
        active: { equals: true },
      };

      const query = buildQuery(filter);
      expect(query).toBe('{"active":true}');
    });

    test("should build greaterThan query", () => {
      type Schema = FlatIndexSchema & { age: "U64" };
      const filter: QueryFilter<Schema> = {
        age: { greaterThan: 18 },
      };

      const query = buildQuery(filter);
      expect(query).toBe('{"age":{"$range":{"$gt":18}}}');
    });

    test("should build greaterThanOrEquals query", () => {
      type Schema = FlatIndexSchema & { age: "U64" };
      const filter: QueryFilter<Schema> = {
        age: { greaterThanOrEquals: 18 },
      };

      const query = buildQuery(filter);
      expect(query).toBe('{"age":{"$range":{"$gte":18}}}');
    });

    test("should build lessThan query", () => {
      type Schema = FlatIndexSchema & { age: "U64" };
      const filter: QueryFilter<Schema> = {
        age: { lessThan: 65 },
      };

      const query = buildQuery(filter);
      expect(query).toBe('{"age":{"$range":{"$lt":65}}}');
    });

    test("should build lessThanOrEquals query", () => {
      type Schema = FlatIndexSchema & { age: "U64" };
      const filter: QueryFilter<Schema> = {
        age: { lessThanOrEquals: 65 },
      };

      const query = buildQuery(filter);
      expect(query).toBe('{"age":{"$range":{"$lte":65}}}');
    });
  });
});

describe("OR operations", () => {
  test("should build simple OR query", () => {
    type Schema = FlatIndexSchema & { name: "TEXT" };
    const filter: QueryFilter<Schema> = {
      OR: [{ name: { equals: "John" } }, { name: { equals: "Jane" } }],
    };

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      $or: [{ name: "John" }, { name: "Jane" }],
    });
  });

  test("should build OR with different fields", () => {
    type Schema = FlatIndexSchema & { name: "TEXT"; age: "U64" };
    const filter: QueryFilter<Schema> = {
      OR: [{ name: { equals: "John" } }, { age: { equals: 25 } }],
    };

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      $or: [{ name: "John" }, { age: 25 }],
    });
  });

  test("should build OR with range queries", () => {
    type Schema = FlatIndexSchema & { age: "U64"; score: "U64" };
    const filter: QueryFilter<Schema> = {
      OR: [{ age: { lessThan: 18 } }, { score: { greaterThan: 90 } }],
    };

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      $or: [{ age: { $range: { $lt: 18 } } }, { score: { $range: { $gt: 90 } } }],
    });
  });
});

describe("AND operations", () => {
  test("should build simple AND query", () => {
    type Schema = FlatIndexSchema & { name: "TEXT"; age: "U64" };
    const filter: QueryFilter<Schema> = {
      AND: [{ name: { equals: "John" } }, { age: { greaterThan: 18 } }],
    };

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      name: "John",
      age: { $range: { $gt: 18 } },
    });
  });

  test("should build AND with multiple numeric conditions", () => {
    type Schema = FlatIndexSchema & { age: "U64"; score: "F64"; active: "BOOL" };
    const filter: QueryFilter<Schema> = {
      AND: [
        { age: { greaterThan: 18 } },
        { score: { greaterThanOrEquals: 50 } },
        { active: { equals: true } },
      ],
    };

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      age: { $range: { $gt: 18 } },
      score: { $range: { $gte: 50 } },
      active: true,
    });
  });
});

describe("Nested operations", () => {
  test("should build OR within AND", () => {
    type Schema = FlatIndexSchema & { status: "TEXT"; name: "TEXT"; age: "U64" };
    const filter: QueryFilter<Schema> = {
      AND: [
        { status: { equals: "active" } },
        {
          OR: [{ name: { equals: "John" } }, { age: { greaterThan: 30 } }],
        },
      ],
    };

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      status: "active",
      $or: [{ name: "John" }, { age: { $range: { $gt: 30 } } }],
    });
  });

  test("should build AND within OR", () => {
    type Schema = FlatIndexSchema & { name: "TEXT"; age: "U64"; active: "BOOL" };
    const filter: QueryFilter<Schema> = {
      OR: [
        {
          AND: [{ name: { equals: "John" } }, { age: { greaterThan: 18 } }],
        },
        { active: { equals: false } },
      ],
    };

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      $or: [{ name: "John", age: { $range: { $gt: 18 } } }, { active: false }],
    });
  });
});

describe("Nested schema support", () => {
  test("should build query for nested fields", () => {
    type Schema = NestedIndexSchema & {
      name: "TEXT";
      profile: {
        age: "U64";
        city: "TEXT";
      };
    };

    // TypeScript has trouble inferring deep nested paths
    const filter = {
      "profile.age": { greaterThan: 25 },
    } as unknown as QueryFilter<Schema>;

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      "profile.age": { $range: { $gt: 25 } },
    });
  });

  test("should build complex query with nested fields", () => {
    type Schema = NestedIndexSchema & {
      name: "TEXT";
      profile: {
        age: "U64";
        location: {
          city: "TEXT";
        };
      };
    };

    // TypeScript has trouble inferring deep nested paths in complex AND arrays
    const filter = {
      AND: [
        { name: { equals: "John" } },
        { "profile.age": { greaterThan: 18 } },
        { "profile.location.city": { equals: "NYC" } },
      ],
    } as unknown as QueryFilter<Schema>;

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      name: "John",
      "profile.age": { $range: { $gt: 18 } },
      "profile.location.city": "NYC",
    });
  });
});

describe("Date handling", () => {
  test("should convert Date objects to ISO strings", () => {
    type Schema = FlatIndexSchema & { createdAt: "DATE" };
    const date = new Date("2024-01-01T00:00:00.000Z");
    const filter: QueryFilter<Schema> = {
      createdAt: { equals: date },
    };

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      createdAt: "2024-01-01T00:00:00.000Z",
    });
  });

  test("should handle date range queries", () => {
    type Schema = FlatIndexSchema & { createdAt: "DATE" };
    const filter: QueryFilter<Schema> = {
      createdAt: { greaterThan: "2024-01-01" },
    };

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      createdAt: { $range: { $gt: "2024-01-01" } },
    });
  });
});

describe("Real-world scenarios", () => {
  test("should build user search query", () => {
    type Schema = FlatIndexSchema & {
      status: "TEXT";
      age: "U64";
      department: "TEXT";
      role: "TEXT";
    };

    const filter: QueryFilter<Schema> = {
      AND: [
        { status: { equals: "active" } },
        { age: { greaterThanOrEquals: 18 } },
        {
          OR: [
            { department: { equals: "engineering" } },
            { department: { equals: "design" } },
            { role: { equals: "manager" } },
          ],
        },
      ],
    };

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      status: "active",
      age: { $range: { $gte: 18 } },
      $or: [
        { $or: [{ department: "engineering" }, { department: "design" }] },
        { role: "manager" },
      ],
    });
  });

  test("should build product filtering query", () => {
    type Schema = FlatIndexSchema & {
      category: "TEXT";
      price: "F64";
      inStock: "BOOL";
      brand: "TEXT";
      rating: "F64";
    };

    const filter: QueryFilter<Schema> = {
      AND: [
        { category: { equals: "electronics" } },
        { price: { lessThan: 1000 } },
        { inStock: { equals: true } },
        {
          OR: [
            { brand: { equals: "Apple" } },
            { brand: { equals: "Samsung" } },
            { rating: { greaterThan: 4.5 } },
          ],
        },
      ],
    };

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      category: "electronics",
      price: { $range: { $lt: 1000 } },
      inStock: true,
      $or: [
        { $or: [{ brand: "Apple" }, { brand: "Samsung" }] },
        { rating: { $range: { $gt: 4.5 } } },
      ],
    });
  });

  test("should build date range query", () => {
    type Schema = FlatIndexSchema & {
      startDate: "DATE";
      endDate: "DATE";
      status: "TEXT";
    };

    const filter: QueryFilter<Schema> = {
      AND: [
        { startDate: { greaterThanOrEquals: "2023-01-01" } },
        { endDate: { lessThanOrEquals: "2023-12-31" } },
        { status: { equals: "published" } },
      ],
    };

    const query = buildQuery(filter);
    const parsed = JSON.parse(query);
    expect(parsed).toEqual({
      startDate: { $range: { $gte: "2023-01-01" } },
      endDate: { $range: { $lte: "2023-12-31" } },
      status: "published",
    });
  });
});

describe("Query Command Builder (JSON)", () => {
  test("should build basic command without TANTIVY flag", () => {
    const command = buildQueryCommand("myindex", '{"name":"John"}');
    expect(command).toEqual(["SEARCH.QUERY", "myindex", '{"name":"John"}']);
  });

  test("should build command with limit", () => {
    const command = buildQueryCommand("myindex", '{"name":"John"}', { limit: 10 });
    expect(command).toEqual(["SEARCH.QUERY", "myindex", '{"name":"John"}', "LIMIT", "10"]);
  });

  test("should build command with offset", () => {
    const command = buildQueryCommand("myindex", '{"name":"John"}', { offset: 20 });
    expect(command).toEqual(["SEARCH.QUERY", "myindex", '{"name":"John"}', "OFFSET", "20"]);
  });

  test("should build command with limit and offset", () => {
    const command = buildQueryCommand("myindex", '{"name":"John"}', { limit: 10, offset: 20 });
    expect(command).toEqual([
      "SEARCH.QUERY",
      "myindex",
      '{"name":"John"}',
      "LIMIT",
      "10",
      "OFFSET",
      "20",
    ]);
  });

  test("should build command with noContent", () => {
    const command = buildQueryCommand("myindex", '{"name":"John"}', { noContent: true });
    expect(command).toEqual(["SEARCH.QUERY", "myindex", '{"name":"John"}', "NOCONTENT"]);
  });

  test("should build command with sortBy ascending", () => {
    const command = buildQueryCommand("myindex", '{"name":"John"}', {
      sortBy: { field: "age", direction: "ASC" },
    });
    expect(command).toEqual(["SEARCH.QUERY", "myindex", '{"name":"John"}', "SORTBY", "age", "ASC"]);
  });

  test("should build command with sortBy descending", () => {
    const command = buildQueryCommand("myindex", '{"name":"John"}', {
      sortBy: { field: "price", direction: "DESC" },
    });
    expect(command).toEqual([
      "SEARCH.QUERY",
      "myindex",
      '{"name":"John"}',
      "SORTBY",
      "price",
      "DESC",
    ]);
  });

  test("should build command with sortBy without direction", () => {
    const command = buildQueryCommand("myindex", '{"name":"John"}', {
      sortBy: { field: "age" },
    });
    expect(command).toEqual(["SEARCH.QUERY", "myindex", '{"name":"John"}', "SORTBY", "age"]);
  });

  test("should build command with returnFields", () => {
    const command = buildQueryCommand("myindex", '{"name":"John"}', {
      returnFields: ["name", "age"],
    });
    expect(command).toEqual([
      "SEARCH.QUERY",
      "myindex",
      '{"name":"John"}',
      "RETURN",
      "2",
      "name",
      "age",
    ]);
  });

  test("should build command with all options", () => {
    const command = buildQueryCommand("myindex", '{"name":"John"}', {
      limit: 10,
      offset: 20,
      sortBy: { field: "age", direction: "DESC" },
      returnFields: ["name", "age", "email"],
    });
    expect(command).toEqual([
      "SEARCH.QUERY",
      "myindex",
      '{"name":"John"}',
      "LIMIT",
      "10",
      "OFFSET",
      "20",
      "SORTBY",
      "age",
      "DESC",
      "RETURN",
      "3",
      "name",
      "age",
      "email",
    ]);
  });
});
