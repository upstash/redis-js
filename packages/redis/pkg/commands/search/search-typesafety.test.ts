import { describe, expect, test } from "bun:test";
import { initIndex, SearchIndex } from "./search";
import { s } from "./schema-builder";
import type { Requester } from "../../http";

// ─── Mock Requester ──────────────────────────────────────────────────────
function mockRequester(result: unknown): Requester {
  return {
    request: async <TResult>() => ({ result: result as TResult }),
  };
}

// ─── Schemas ─────────────────────────────────────────────────────────────
const flatSchema = s.object({
  title: s.string(),
  price: s.number(),
  active: s.boolean(),
  tag: s.keyword(),
  category: s.facet(),
  createdAt: s.date(),
});

const nestedSchema = s.object({
  content: s.object({
    title: s.string(),
    body: s.string(),
  }),
  metadata: s.object({
    author: s.string(),
    views: s.number(),
    category: s.facet(),
  }),
  published: s.boolean(),
});

// ─── Initialization ─────────────────────────────────────────────────────

describe("SearchIndex initialization", () => {
  test("initIndex with schema returns typed SearchIndex", () => {
    const client = mockRequester(null);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    expect(index).toBeInstanceOf(SearchIndex);
    expect(index.name).toBe("idx");
    expect(index.schema).toEqual(flatSchema);
  });

  test("initIndex without schema returns SearchIndex<any>", () => {
    const client = mockRequester(null);
    const index = initIndex(client, { name: "idx" });

    expect(index).toBeInstanceOf(SearchIndex);
    expect(index.name).toBe("idx");
    expect(index.schema).toBeUndefined();
  });

  test("new SearchIndex with schema", () => {
    const client = mockRequester(null);
    const index = new SearchIndex({ name: "idx", client, schema: flatSchema });

    expect(index).toBeInstanceOf(SearchIndex);
    expect(index.schema).toEqual(flatSchema);
  });

  test("new SearchIndex without schema", () => {
    const client = mockRequester(null);
    const index = new SearchIndex({ name: "idx", client });

    expect(index).toBeInstanceOf(SearchIndex);
    expect(index.schema).toBeUndefined();
  });

  test("initIndex with nested schema", () => {
    const client = mockRequester(null);
    const index = initIndex(client, { name: "idx", schema: nestedSchema });

    expect(index).toBeInstanceOf(SearchIndex);
    expect(index.schema).toEqual(nestedSchema);
  });
});

// ─── query() with flat schema ────────────────────────────────────────────

describe("query - flat schema", () => {
  test("filter with valid field paths", async () => {
    const queryResponse = [["key:1", "1.0", [["title", "hello"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      filter: { title: { $eq: "hello" } },
    });

    expect(results).toHaveLength(1);
    expect(results[0].key).toBe("key:1");
    expect(results[0].data.title).toBe("hello");
  });

  test("filter with numeric field", async () => {
    const queryResponse = [["key:1", "1.0", [["price", 42]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      filter: { price: { $gte: 10 } },
    });

    expect(results).toHaveLength(1);
    expect(results[0].data.price).toBe(42);
  });

  test("filter with boolean field", async () => {
    const queryResponse = [["key:1", "1.0", [["active", true]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      filter: { active: { $eq: true } },
    });

    expect(results).toHaveLength(1);
    expect(results[0].data.active).toBe(true);
  });

  test("highlight with valid fields", async () => {
    const queryResponse = [["key:1", "1.0", [["title", "<b>hello</b>"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      highlight: {
        fields: ["title"],
        preTag: "<b>",
        postTag: "</b>",
      },
    });

    expect(results).toHaveLength(1);
    expect(results[0].data.title).toBe("<b>hello</b>");
  });

  test("select restricts returned data type", async () => {
    const queryResponse = [["key:1", "1.0", [["title", "hello"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      select: { title: true },
    });

    expect(results).toHaveLength(1);
    expect(results[0].data.title).toBe("hello");
  });

  test("select with multiple fields", async () => {
    const queryResponse = [
      [
        "key:1",
        "1.0",
        [
          ["title", "hello"],
          ["price", 42],
        ],
      ],
    ];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      select: { title: true, price: true },
    });

    expect(results).toHaveLength(1);
    expect(results[0].data.title).toBe("hello");
    expect(results[0].data.price).toBe(42);
  });

  test("select with empty object returns no data", async () => {
    const queryResponse = [["key:1", "1.0"]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      select: {},
    });

    expect(results).toHaveLength(1);
    expect(results[0].key).toBe("key:1");
    // With empty select, there should be no data property
    expect(results[0]).not.toHaveProperty("data");
  });

  test("orderBy with valid field", async () => {
    const queryResponse = [
      ["key:1", "1.0", [["title", "a"]]],
      ["key:2", "0.5", [["title", "b"]]],
    ];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      orderBy: { title: "ASC" },
    });

    expect(results).toHaveLength(2);
  });

  test("filter with $and boolean operator", async () => {
    const queryResponse = [
      [
        "key:1",
        "1.0",
        [
          ["title", "hello"],
          ["price", 42],
        ],
      ],
    ];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      filter: {
        $and: [{ title: { $eq: "hello" } }, { price: { $gte: 10 } }],
      },
    });

    expect(results).toHaveLength(1);
  });

  test("filter with $or boolean operator", async () => {
    const queryResponse = [["key:1", "1.0", [["title", "hello"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      filter: {
        $or: [{ title: { $eq: "hello" } }, { title: { $eq: "world" } }],
      },
    });

    expect(results).toHaveLength(1);
  });

  test("query with no options returns all data", async () => {
    const queryResponse = [
      [
        "key:1",
        "1.0",
        [
          ["title", "hello"],
          ["price", 42],
          ["active", true],
        ],
      ],
    ];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query();

    expect(results).toHaveLength(1);
    expect(results[0].data.title).toBe("hello");
    expect(results[0].data.price).toBe(42);
    expect(results[0].data.active).toBe(true);
  });

  test("filter with keyword field operators", async () => {
    const queryResponse = [["key:1", "1.0", [["tag", "electronics"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      filter: { tag: { $eq: "electronics" } },
    });

    expect(results).toHaveLength(1);
    expect(results[0].data.tag).toBe("electronics");
  });

  test("filter with date field", async () => {
    const queryResponse = [["key:1", "1.0", [["createdAt", "2024-01-01"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      filter: { createdAt: { $gte: "2024-01-01" } },
    });

    expect(results).toHaveLength(1);
  });
});

// ─── query() with nested schema ─────────────────────────────────────────

describe("query - nested schema", () => {
  test("filter with dot-notation paths", async () => {
    const queryResponse = [["key:1", "1.0", [["content.title", "hello"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: nestedSchema });

    const results = await index.query({
      filter: { "content.title": { $eq: "hello" } },
    });

    expect(results).toHaveLength(1);
    expect(results[0].data.content.title).toBe("hello");
  });

  test("highlight with nested fields", async () => {
    const queryResponse = [["key:1", "1.0", [["content.title", "<em>hello</em>"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: nestedSchema });

    const results = await index.query({
      highlight: {
        fields: ["content.title", "content.body"],
        preTag: "<em>",
        postTag: "</em>",
      },
    });

    expect(results).toHaveLength(1);
  });

  test("select with nested fields builds nested result type", async () => {
    const queryResponse = [
      [
        "key:1",
        "1.0",
        [
          ["content.title", "hello"],
          ["metadata.author", "alice"],
        ],
      ],
    ];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: nestedSchema });

    const results = await index.query({
      select: { "content.title": true, "metadata.author": true },
    });

    expect(results).toHaveLength(1);
    expect(results[0].data.content.title).toBe("hello");
    expect(results[0].data.metadata.author).toBe("alice");
  });

  test("filter with nested numeric field", async () => {
    const queryResponse = [["key:1", "1.0", [["metadata.views", 100]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: nestedSchema });

    const results = await index.query({
      filter: { "metadata.views": { $gte: 50 } },
    });

    expect(results).toHaveLength(1);
  });

  test("orderBy with nested field", async () => {
    const queryResponse = [["key:1", "2.0", [["metadata.views", 100]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: nestedSchema });

    const results = await index.query({
      orderBy: { "metadata.views": "DESC" },
    });

    expect(results).toHaveLength(1);
  });

  test("query returns fully nested data without select", async () => {
    const queryResponse = [
      [
        "key:1",
        "1.0",
        [
          ["content.title", "hello"],
          ["content.body", "world"],
          ["metadata.author", "alice"],
          ["metadata.views", 100],
          ["published", true],
        ],
      ],
    ];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: nestedSchema });

    const results = await index.query();

    expect(results).toHaveLength(1);
    expect(results[0].data.content.title).toBe("hello");
    expect(results[0].data.content.body).toBe("world");
    expect(results[0].data.metadata.author).toBe("alice");
    expect(results[0].data.metadata.views).toBe(100);
    expect(results[0].data.published).toBe(true);
  });
});

// ─── query() without schema ─────────────────────────────────────────────

describe("query - no schema", () => {
  test("filter accepts any field names", async () => {
    const queryResponse = [["key:1", "1.0", [["anything", "value"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx" });

    const results = await index.query({
      filter: { anything: { $eq: "value" } },
    });

    expect(results).toHaveLength(1);
    expect(results[0].data.anything).toBe("value");
  });

  test("highlight accepts any field names", async () => {
    const queryResponse = [["key:1", "1.0", [["whatever", "value"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx" });

    const results = await index.query({
      highlight: {
        fields: ["whatever", "another.nested.field"],
      },
    });

    expect(results).toHaveLength(1);
  });

  test("select accepts any field names", async () => {
    const queryResponse = [["key:1", "1.0", [["foo", "bar"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx" });

    const results = await index.query({
      select: { foo: true },
    });

    expect(results).toHaveLength(1);
    expect(results[0].data.foo).toBe("bar");
  });

  test("orderBy accepts any field names", async () => {
    const queryResponse = [["key:1", "1.0", [["foo", "bar"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx" });

    const results = await index.query({
      orderBy: { whatever: "ASC" },
    });

    expect(results).toHaveLength(1);
  });

  test("data is typed as any", async () => {
    const queryResponse = [
      [
        "key:1",
        "1.0",
        [
          ["x", 1],
          ["y", "z"],
        ],
      ],
    ];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx" });

    const results = await index.query();

    expect(results).toHaveLength(1);
    // With no schema, data is `any` so any access is allowed
    expect(results[0].data.x).toBe(1);
    expect(results[0].data.y).toBe("z");
    expect(results[0].data.nonExistent).toBeUndefined();
  });
});

// ─── count() ─────────────────────────────────────────────────────────────

describe("count - with schema", () => {
  test("filter uses typed field paths", async () => {
    const client = mockRequester(5);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const result = await index.count({
      filter: { title: { $eq: "hello" } },
    });

    expect(result).toEqual({ count: 5 });
  });

  test("filter with $and operator", async () => {
    const client = mockRequester(3);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const result = await index.count({
      filter: {
        $and: [{ title: { $eq: "hello" } }, { price: { $gte: 10 } }],
      },
    });

    expect(result).toEqual({ count: 3 });
  });

  test("filter with nested schema", async () => {
    const client = mockRequester(7);
    const index = initIndex(client, { name: "idx", schema: nestedSchema });

    const result = await index.count({
      filter: { "content.title": { $eq: "hello" } },
    });

    expect(result).toEqual({ count: 7 });
  });
});

describe("count - no schema", () => {
  test("filter accepts any field names", async () => {
    const client = mockRequester(10);
    const index = initIndex(client, { name: "idx" });

    const result = await index.count({
      filter: { anyField: { $eq: "value" } },
    });

    expect(result).toEqual({ count: 10 });
  });
});

// ─── aggregate() ─────────────────────────────────────────────────────────

describe("aggregate - with schema", () => {
  test("terms aggregation with typed field", async () => {
    const aggResponse = [
      "titleAgg",
      [
        "buckets",
        [["key", "hello", "docCount", 5]],
        "sumOtherDocCount",
        0,
        "docCountErrorUpperBound",
        0,
      ],
    ];
    const client = mockRequester(aggResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const result = await index.aggregate({
      aggregations: {
        titleAgg: {
          $terms: { field: "title" },
        },
      },
    });

    expect(result.titleAgg.buckets).toHaveLength(1);
    expect(result.titleAgg.buckets[0].key).toBe("hello");
    expect(result.titleAgg.buckets[0].docCount).toBe(5);
  });

  test("stats aggregation with typed field", async () => {
    const aggResponse = ["priceStats", ["count", 10, "min", 1, "max", 100, "sum", 550, "avg", 55]];
    const client = mockRequester(aggResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const result = await index.aggregate({
      aggregations: {
        priceStats: {
          $stats: { field: "price" },
        },
      },
    });

    expect(result.priceStats.count).toBe(10);
    expect(result.priceStats.min).toBe(1);
    expect(result.priceStats.max).toBe(100);
    expect(result.priceStats.avg).toBe(55);
  });

  test("aggregate with filter uses typed paths", async () => {
    const aggResponse = [
      "titleAgg",
      ["buckets", [], "sumOtherDocCount", 0, "docCountErrorUpperBound", 0],
    ];
    const client = mockRequester(aggResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const result = await index.aggregate({
      filter: { active: { $eq: true } },
      aggregations: {
        titleAgg: {
          $terms: { field: "title" },
        },
      },
    });

    expect(result.titleAgg.buckets).toHaveLength(0);
  });

  test("aggregate with nested schema fields", async () => {
    const aggResponse = [
      "viewsStats",
      ["count", 5, "min", 10, "max", 1000, "sum", 2500, "avg", 500],
    ];
    const client = mockRequester(aggResponse);
    const index = initIndex(client, { name: "idx", schema: nestedSchema });

    const result = await index.aggregate({
      aggregations: {
        viewsStats: {
          $stats: { field: "metadata.views" },
        },
      },
    });

    expect(result.viewsStats.avg).toBe(500);
  });

  test("facet aggregation with typed facet field", async () => {
    const aggResponse = [
      "catFacet",
      [
        "path",
        "/",
        "sumOtherDocCount",
        0,
        "children",
        [["path", "/tech", "docCount", 3, "sumOtherDocCount", 0]],
      ],
    ];
    const client = mockRequester(aggResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const result = await index.aggregate({
      aggregations: {
        catFacet: {
          $facet: { field: "category", path: "/" },
        },
      },
    });

    expect(result.catFacet.path).toBe("/");
  });
});

describe("aggregate - no schema", () => {
  test("accepts any field names", async () => {
    const aggResponse = [
      "myAgg",
      ["buckets", [], "sumOtherDocCount", 0, "docCountErrorUpperBound", 0],
    ];
    const client = mockRequester(aggResponse);
    const index = initIndex(client, { name: "idx" });

    const result = await index.aggregate({
      aggregations: {
        myAgg: {
          $terms: { field: "anyFieldName" },
        },
      },
    });

    expect(result.myAgg.buckets).toHaveLength(0);
  });
});

// ─── describe() ──────────────────────────────────────────────────────────

describe("describe", () => {
  test("returns typed schema field info with schema", async () => {
    const describeResponse = [
      "name",
      "idx",
      "type",
      "JSON",
      "prefixes",
      ["test:"],
      "schema",
      [
        ["title", "TEXT"],
        ["price", "F64", "FAST"],
        ["active", "BOOL"],
      ],
    ];
    const client = mockRequester(describeResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const result = await index.describe();

    expect(result).not.toBeNull();
    expect(result!.name).toBe("idx");
    expect(result!.dataType).toBe("json");
    expect(result!.prefixes).toEqual(["test:"]);
    expect(result!.schema.title).toEqual({ type: "TEXT" });
    expect(result!.schema.price).toEqual({ type: "F64", fast: true });
    expect(result!.schema.active).toEqual({ type: "BOOL" });
  });

  test("returns null when index doesn't exist", async () => {
    const client = mockRequester(null);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const result = await index.describe();

    expect(result).toBeNull();
  });

  test("describe without schema returns any-typed schema", async () => {
    const describeResponse = [
      "name",
      "idx",
      "type",
      "HASH",
      "prefixes",
      ["p:"],
      "schema",
      [["field1", "TEXT"]],
    ];
    const client = mockRequester(describeResponse);
    const index = initIndex(client, { name: "idx" });

    const result = await index.describe();

    expect(result).not.toBeNull();
    expect(result!.name).toBe("idx");
    expect(result!.schema.field1).toEqual({ type: "TEXT" });
  });
});

// ─── Type-level validation tests ─────────────────────────────────────────
// These tests verify compile-time type safety. The @ts-expect-error
// comments assert that invalid usage is correctly rejected by TypeScript.

describe("type safety - compile-time checks", () => {
  test("schema-typed index rejects invalid filter field names", () => {
    const client = mockRequester([]);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    // Valid: field exists in schema
    index.query({ filter: { title: { $eq: "hello" } } });

    // @ts-expect-error - 'nonExistent' is not a field in the schema
    index.query({ filter: { nonExistent: { $eq: "hello" } } });
  });

  test("schema-typed index rejects wrong operator types", () => {
    const client = mockRequester([]);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    // Valid: string eq on TEXT field
    index.query({ filter: { title: { $eq: "hello" } } });

    // @ts-expect-error - number on TEXT field
    index.query({ filter: { title: { $eq: 123 } } });
  });

  test("schema-typed index rejects invalid highlight fields", () => {
    const client = mockRequester([]);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    // Valid
    index.query({ highlight: { fields: ["title"] } });

    // @ts-expect-error - 'nonExistent' is not in schema
    index.query({ highlight: { fields: ["nonExistent"] } });
  });

  test("schema-typed index rejects invalid select fields", () => {
    const client = mockRequester([]);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    // Valid
    index.query({ select: { title: true } });

    // @ts-expect-error - 'nonExistent' not in schema
    index.query({ select: { nonExistent: true } });
  });

  test("schema-typed index rejects invalid orderBy fields", () => {
    const client = mockRequester([]);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    // Valid
    index.query({ orderBy: { title: "ASC" } });

    // @ts-expect-error - 'nonExistent' not in schema
    index.query({ orderBy: { nonExistent: "ASC" } });
  });

  test("schema-typed count rejects invalid filter fields", () => {
    const client = mockRequester(0);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    // Valid
    index.count({ filter: { title: { $eq: "hello" } } });

    // @ts-expect-error - 'nonExistent' is not a field in the schema
    index.count({ filter: { nonExistent: { $eq: "hello" } } });
  });

  test("schema-typed aggregate rejects invalid field references", () => {
    const client = mockRequester([]);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    // Valid
    index.aggregate({ aggregations: { a: { $terms: { field: "title" } } } });

    // @ts-expect-error - 'nonExistent' not in schema
    index.aggregate({ aggregations: { a: { $terms: { field: "nonExistent" } } } });
  });

  test("nested schema rejects invalid nested paths", () => {
    const client = mockRequester([]);
    const index = initIndex(client, { name: "idx", schema: nestedSchema });

    // Valid: correct dot-notation paths
    index.query({ filter: { "content.title": { $eq: "hello" } } });
    index.query({ highlight: { fields: ["content.title", "metadata.author"] } });

    // @ts-expect-error - 'content' is not a leaf field
    index.query({ filter: { content: { $eq: "hello" } } });

    // @ts-expect-error - 'content.nonExistent' is not a valid path
    index.query({ filter: { "content.nonExistent": { $eq: "hello" } } });
  });

  test("nested schema rejects invalid nested highlight fields", () => {
    const client = mockRequester([]);
    const index = initIndex(client, { name: "idx", schema: nestedSchema });

    // Valid
    index.query({ highlight: { fields: ["content.title"] } });

    // @ts-expect-error - 'nonExistent.field' is not in schema
    index.query({ highlight: { fields: ["nonExistent.field"] } });
  });

  test("nested schema rejects invalid aggregate field paths", () => {
    const client = mockRequester([]);
    const index = initIndex(client, { name: "idx", schema: nestedSchema });

    // Valid
    index.aggregate({ aggregations: { a: { $terms: { field: "metadata.views" } } } });

    // @ts-expect-error - 'metadata.nonExistent' not in schema
    index.aggregate({ aggregations: { a: { $terms: { field: "metadata.nonExistent" } } } });
  });

  test("facet aggregation only accepts FACET-typed fields", () => {
    const client = mockRequester([]);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    // Valid: category is a FACET field
    index.aggregate({ aggregations: { a: { $facet: { field: "category", path: "/" } } } });

    // @ts-expect-error - 'title' is TEXT, not FACET
    index.aggregate({ aggregations: { a: { $facet: { field: "title", path: "/" } } } });
  });

  test("untyped index accepts any field names everywhere", () => {
    const client = mockRequester([]);
    const index = initIndex(client, { name: "idx" });

    // All of these should compile without errors
    index.query({ filter: { anyField: { $eq: "value" } } });
    index.query({ highlight: { fields: ["anyField"] } });
    index.query({ select: { anyField: true } });
    index.query({ orderBy: { anyField: "ASC" } });
    index.count({ filter: { anyField: { $eq: "value" } } });
    index.aggregate({ aggregations: { a: { $terms: { field: "anyField" } } } });
  });
});

// ─── Edge cases ──────────────────────────────────────────────────────────

describe("edge cases", () => {
  test("query with limit and offset", async () => {
    const queryResponse = [["key:1", "1.0", [["title", "hello"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      limit: 10,
      offset: 5,
      filter: { title: { $eq: "hello" } },
    });

    expect(results).toHaveLength(1);
  });

  test("query returns empty array for no results", async () => {
    const client = mockRequester([]);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      filter: { title: { $eq: "nonExistent" } },
    });

    expect(results).toHaveLength(0);
  });

  test("count returns 0", async () => {
    const client = mockRequester(0);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const result = await index.count({
      filter: { title: { $eq: "nonExistent" } },
    });

    expect(result).toEqual({ count: 0 });
  });

  test("filter with $in array operator", async () => {
    const queryResponse = [["key:1", "1.0", [["title", "hello"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      filter: { title: { $in: ["hello", "world"] } },
    });

    expect(results).toHaveLength(1);
  });

  test("filter with $fuzzy on text field", async () => {
    const queryResponse = [["key:1", "0.8", [["title", "hello"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      filter: { title: { $fuzzy: "helo" } },
    });

    expect(results).toHaveLength(1);
  });

  test("filter with $phrase on text field", async () => {
    const queryResponse = [["key:1", "1.0", [["title", "hello world"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      filter: { title: { $phrase: "hello world" } },
    });

    expect(results).toHaveLength(1);
  });

  test("filter with $regex on text field", async () => {
    const queryResponse = [["key:1", "1.0", [["title", "hello123"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      filter: { title: { $regex: String.raw`hello\d+` } },
    });

    expect(results).toHaveLength(1);
  });

  test("scoreFunc with schema field", async () => {
    const queryResponse = [
      [
        "key:1",
        "42.0",
        [
          ["title", "hello"],
          ["price", 42],
        ],
      ],
    ];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      scoreFunc: { field: "price", modifier: "log1p" },
    });

    expect(results).toHaveLength(1);
    expect(results[0].score).toBe(42);
  });

  test("scoreFunc with multiple fields", async () => {
    const queryResponse = [
      [
        "key:1",
        "50.0",
        [
          ["title", "hello"],
          ["price", 42],
        ],
      ],
    ];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const results = await index.query({
      scoreFunc: {
        fields: [{ field: "price", modifier: "log1p", factor: 2 }, "price"],
        combineMode: "sum",
        scoreMode: "replace",
      },
    });

    expect(results).toHaveLength(1);
  });

  test("drop returns result", async () => {
    const client = mockRequester(1);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const result = await index.drop();
    expect(result).toBe(1);
  });

  test("waitIndexing returns result", async () => {
    const client = mockRequester(0);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const result = await index.waitIndexing();
    expect(result).toBe(0);
  });

  test("addAlias returns result", async () => {
    const client = mockRequester(1);
    const index = initIndex(client, { name: "idx", schema: flatSchema });

    const result = await index.addAlias({ alias: "my-alias" });
    expect(result).toBe(1);
  });
});

// ─── Schema with 'from' field (alias) ────────────────────────────────────

describe("schema with 'from' field alias", () => {
  const schemaWithFrom = s.object({
    title: s.string().from("$.document_title"),
    score: s.number().from("$.doc_score"),
    visible: s.boolean(),
  });

  test("query with from-aliased schema", async () => {
    const queryResponse = [
      [
        "key:1",
        "1.0",
        [
          ["title", "hello"],
          ["visible", true],
        ],
      ],
    ];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: schemaWithFrom });

    const results = await index.query({
      filter: { title: { $eq: "hello" } },
    });

    expect(results).toHaveLength(1);
    // Fields with 'from' are excluded from InferSchemaData keys
    // 'visible' should still be accessible
    expect(results[0].data.visible).toBe(true);
  });

  test("highlight with from-aliased fields", async () => {
    const queryResponse = [["key:1", "1.0", [["title", "<b>hello</b>"]]]];
    const client = mockRequester(queryResponse);
    const index = initIndex(client, { name: "idx", schema: schemaWithFrom });

    const results = await index.query({
      highlight: {
        fields: ["title"],
        preTag: "<b>",
        postTag: "</b>",
      },
    });

    expect(results).toHaveLength(1);
  });
});
