import { describe, test, expect } from "bun:test";
import {
  flattenSchema,
  deserializeQueryResponse,
  deserializeDescribeResponse,
  parseCountResponse,
} from "./utils";
import { s } from "./schema-builder";
import { IndexDescription } from "./types";

describe("flattenSchema", () => {
  describe("flat schemas", () => {
    test("flattens simple flat schema with literal types", () => {
      const schema = {
        name: "TEXT" as const,
        age: "U64" as const,
      };

      const result = flattenSchema(schema);

      expect(result).toEqual([
        { path: "name", type: "TEXT" },
        { path: "age", type: "U64" },
      ]);
    });

    test("flattens flat schema with detailed field types", () => {
      const schema = s.object({
        name: s.text().noTokenize(),
        age: s.number("U64"),
      });

      const result = flattenSchema(schema);

      expect(result).toEqual([
        { path: "name", type: "TEXT", noTokenize: true },
        { path: "age", type: "U64", fast: true },
      ]);
    });

    test("flattens schema with all field options", () => {
      const schema = s.object({
        title: s.text().noTokenize().noStem(),
        count: s.number("U64"),
        active: s.bool().fast(),
        date: s.date().fast(),
      });

      const result = flattenSchema(schema);

      expect(result).toEqual([
        { path: "title", type: "TEXT", noTokenize: true, noStem: true },
        { path: "count", type: "U64", fast: true },
        { path: "active", type: "BOOL", fast: true },
        { path: "date", type: "DATE", fast: true },
      ]);
    });
  });

  describe("nested schemas", () => {
    test("flattens single level nested schema", () => {
      const schema = s.object({
        name: s.text(),
        profile: s.object({
          age: s.number("U64"),
          city: s.text(),
        }),
      });

      const result = flattenSchema(schema);

      expect(result).toEqual([
        { path: "name", type: "TEXT" },
        { path: "profile.age", type: "U64", fast: true },
        { path: "profile.city", type: "TEXT" },
      ]);
    });

    test("flattens deeply nested schema", () => {
      const schema = s.object({
        data: s.object({
          metadata: s.object({
            tags: s.text(),
            count: s.number("U64"),
          }),
        }),
      });

      const result = flattenSchema(schema);

      expect(result).toEqual([
        { path: "data.metadata.tags", type: "TEXT" },
        { path: "data.metadata.count", type: "U64", fast: true },
      ]);
    });

    test("flattens complex nested schema with mixed types", () => {
      const schema = s.object({
        id: s.text(),
        content: s.object({
          title: s.text().noStem(),
          body: s.text(),
        }),
        metadata: s.object({
          created: s.date().fast(),
          updated: s.date(),
          views: s.number("U64"),
        }),
      });

      const result = flattenSchema(schema);

      expect(result).toEqual([
        { path: "id", type: "TEXT" },
        { path: "content.title", type: "TEXT", noStem: true },
        { path: "content.body", type: "TEXT" },
        { path: "metadata.created", type: "DATE", fast: true },
        { path: "metadata.updated", type: "DATE" },
        { path: "metadata.views", type: "U64", fast: true },
      ]);
    });
  });

  describe("all field types", () => {
    test("handles all supported field types", () => {
      const schema = s.object({
        text: s.text(),
        unsignedInt: s.number("U64"),
        signedInt: s.number("I64"),
        float: s.number("F64"),
        bool: s.bool(),
        date: s.date(),
      });

      const result = flattenSchema(schema);

      expect(result).toEqual([
        { path: "text", type: "TEXT" },
        { path: "unsignedInt", type: "U64", fast: true },
        { path: "signedInt", type: "I64", fast: true },
        { path: "float", type: "F64", fast: true },
        { path: "bool", type: "BOOL" },
        { path: "date", type: "DATE" },
      ]);
    });
  });
});

describe("deserializeQueryResponse", () => {
  describe("with content", () => {
    test("parses query response with fields as merged data object", () => {
      const rawResponse = [
        [
          "doc:1",
          "0.95",
          [
            ["name", "John"],
            ["age", "30"],
          ],
        ],
        [
          "doc:2",
          "0.85",
          [
            ["name", "Jane"],
            ["age", "25"],
          ],
        ],
      ];

      const result = deserializeQueryResponse(rawResponse);

      expect(result).toEqual([
        {
          key: "doc:1",
          score: "0.95",
          data: { name: "John", age: "30" },
        },
        {
          key: "doc:2",
          score: "0.85",
          data: { name: "Jane", age: "25" },
        },
      ]);
    });

    test("handles empty fields array", () => {
      const rawResponse = [["doc:1", "1.0", []]];

      const result = deserializeQueryResponse(rawResponse);

      expect(result).toEqual([
        {
          key: "doc:1",
          score: "1.0",
          data: {},
        },
      ]);
    });

    test("handles missing fields (non-array)", () => {
      const rawResponse = [["doc:1", "1.0", null]];

      const result = deserializeQueryResponse(rawResponse);

      expect(result).toEqual([
        {
          key: "doc:1",
          score: "1.0",
          data: {},
        },
      ]);
    });

    test("handles $ key (full document) by unwrapping it", () => {
      const rawResponse = [
        [
          "doc:1",
          "0.95",
          [
            [
              "$",
              {
                id: "123",
                content: { title: "Hello", body: "World" },
                metadata: { views: 100 },
              },
            ],
          ],
        ],
      ];

      const result = deserializeQueryResponse(rawResponse);

      expect(result).toEqual([
        {
          key: "doc:1",
          score: "0.95",
          data: {
            id: "123",
            content: { title: "Hello", body: "World" },
            metadata: { views: 100 },
          },
        },
      ]);
    });

    test("converts dot notation keys to nested objects", () => {
      const rawResponse = [
        [
          "doc:1",
          "0.95",
          [
            ["content.title", "Hello"],
            ["content.body", "World"],
            ["metadata.views", 100],
          ],
        ],
      ];

      const result = deserializeQueryResponse(rawResponse);

      expect(result).toEqual([
        {
          key: "doc:1",
          score: "0.95",
          data: {
            content: { title: "Hello", body: "World" },
            metadata: { views: 100 },
          },
        },
      ]);
    });
  });

  describe("with noContent option", () => {
    test("parses response without content", () => {
      const rawResponse = [
        ["doc:1", "0.95"],
        ["doc:2", "0.85"],
      ];

      const result = deserializeQueryResponse(rawResponse, {
        filter: { category: { $eq: "electronics" } },
        select: {},
      });

      expect(result).toEqual([
        { key: "doc:1", score: "0.95" },
        { key: "doc:2", score: "0.85" },
      ]);
    });
  });

  describe("edge cases", () => {
    test("handles empty response", () => {
      const result = deserializeQueryResponse([]);

      expect(result).toEqual([]);
    });

    test("handles single result", () => {
      const rawResponse = [["doc:1", "1.0", [["field", "value"]]]];

      const result = deserializeQueryResponse(rawResponse);

      expect(result).toEqual([
        {
          key: "doc:1",
          score: "1.0",
          data: { field: "value" },
        },
      ]);
    });
  });
});

describe("deserializeDescribeResponse", () => {
  test("deserializes raw key-value array response", () => {
    const rawResponse = [
      "name",
      "test-index",
      "type",
      "HASH",
      "prefixes",
      ["user:"],
      "language",
      "english",
      "schema",
      [
        ["name", "TEXT"],
        ["age", "U64"],
      ],
    ];

    const result = deserializeDescribeResponse(rawResponse);

    expect(result).toEqual({
      indexName: "test-index",
      dataType: "hash",
      prefixes: ["user:"],
      language: "english",
      schema: {
        name: "TEXT",
        age: "U64",
      },
    });
  });

  test("handles response without optional language", () => {
    const rawResponse = [
      "name",
      "doc",
      "type",
      "STRING",
      "prefixes",
      ["doc:"],
      "schema",
      [["title", "TEXT"]],
    ];

    const result = deserializeDescribeResponse(rawResponse);

    expect(result).toEqual({
      indexName: "doc",
      dataType: "string",
      prefixes: ["doc:"],
      schema: {
        title: "TEXT",
      },
    });
  });

  test("keeps dot notation for nested fields", () => {
    const rawResponse = [
      "name",
      "vercel-changelog",
      "type",
      "STRING",
      "prefixes",
      ["vercel-changelog:"],
      "language",
      "english",
      "schema",
      [
        ["id", "TEXT"],
        ["content.title", "TEXT"],
        ["content.content", "TEXT"],
        ["content.authors", "TEXT"],
        ["metadata.dateInt", "U64"],
        ["metadata.url", "TEXT"],
        ["metadata.updated", "TEXT"],
        ["metadata.kind", "TEXT"],
      ],
    ];

    const result = deserializeDescribeResponse(rawResponse);

    expect(result).toEqual({
      indexName: "vercel-changelog",
      dataType: "string",
      prefixes: ["vercel-changelog:"],
      language: "english",
      schema: {
        id: "TEXT",
        "content.title": "TEXT",
        "content.content": "TEXT",
        "content.authors": "TEXT",
        "metadata.dateInt": "U64",
        "metadata.url": "TEXT",
        "metadata.updated": "TEXT",
        "metadata.kind": "TEXT",
      },
    });
  });

  test("parses all field types", () => {
    const rawResponse = [
      "name",
      "test",
      "type",
      "HASH",
      "prefixes",
      ["test:"],
      "schema",
      [
        ["text", "TEXT"],
        ["date", "DATE"],
        ["unsigned", "U64"],
        ["signed", "I64"],
        ["float", "F64"],
        ["flag", "BOOL"],
      ],
    ];

    const result = deserializeDescribeResponse(rawResponse);

    expect(result).toEqual({
      indexName: "test",
      dataType: "hash",
      prefixes: ["test:"],
      schema: {
        text: "TEXT",
        date: "DATE",
        unsigned: "U64",
        signed: "I64",
        float: "F64",
        flag: "BOOL",
      },
    });
  });
});

describe("parseCountResponse", () => {
  test("returns number when response is a number", () => {
    const result = parseCountResponse(42);

    expect(result).toBe(42);
  });

  test("parses string to number", () => {
    const result = parseCountResponse("42");

    expect(result).toBe(42);
  });

  test("handles zero", () => {
    const result = parseCountResponse(0);

    expect(result).toBe(0);
  });

  test("handles string zero", () => {
    const result = parseCountResponse("0");

    expect(result).toBe(0);
  });
});
