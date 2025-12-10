import { describe, test, expect } from "bun:test";
import {
  flattenSchema,
  parseQueryResponse,
  parseDescribeResponse,
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
        age: s.unsignedInteger().fast(),
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
        count: s.unsignedInteger().fast(),
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
          age: s.unsignedInteger(),
          city: s.text(),
        }),
      });

      const result = flattenSchema(schema);

      expect(result).toEqual([
        { path: "name", type: "TEXT" },
        { path: "profile.age", type: "U64" },
        { path: "profile.city", type: "TEXT" },
      ]);
    });

    test("flattens deeply nested schema", () => {
      const schema = s.object({
        data: s.object({
          metadata: s.object({
            tags: s.text(),
            count: s.unsignedInteger(),
          }),
        }),
      });

      const result = flattenSchema(schema);

      expect(result).toEqual([
        { path: "data.metadata.tags", type: "TEXT" },
        { path: "data.metadata.count", type: "U64" },
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
          views: s.unsignedInteger().fast(),
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
        unsignedInt: s.unsignedInteger(),
        signedInt: s.integer(),
        float: s.float(),
        bool: s.bool(),
        date: s.date(),
      });

      const result = flattenSchema(schema);

      expect(result).toEqual([
        { path: "text", type: "TEXT" },
        { path: "unsignedInt", type: "U64" },
        { path: "signedInt", type: "I64" },
        { path: "float", type: "F64" },
        { path: "bool", type: "BOOL" },
        { path: "date", type: "DATE" },
      ]);
    });
  });
});

describe("parseQueryResponse", () => {
  describe("with content", () => {
    test("parses query response with fields", () => {
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

      const result = parseQueryResponse(rawResponse);

      expect(result).toEqual([
        {
          key: "doc:1",
          score: "0.95",
          fields: [{ name: "John" }, { age: "30" }],
        },
        {
          key: "doc:2",
          score: "0.85",
          fields: [{ name: "Jane" }, { age: "25" }],
        },
      ]);
    });

    test("handles empty fields array", () => {
      const rawResponse = [["doc:1", "1.0", []]];

      const result = parseQueryResponse(rawResponse);

      expect(result).toEqual([
        {
          key: "doc:1",
          score: "1.0",
          fields: [],
        },
      ]);
    });

    test("handles missing fields (non-array)", () => {
      const rawResponse = [["doc:1", "1.0", null]];

      const result = parseQueryResponse(rawResponse);

      expect(result).toEqual([
        {
          key: "doc:1",
          score: "1.0",
          fields: [],
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

      const result = parseQueryResponse(rawResponse, {
        filter: { category: { $eq: "electronics" } },
        noContent: true,
      });

      expect(result).toEqual([
        { key: "doc:1", score: "0.95" },
        { key: "doc:2", score: "0.85" },
      ]);
    });
  });

  describe("edge cases", () => {
    test("handles empty response", () => {
      const result = parseQueryResponse([]);

      expect(result).toEqual([]);
    });

    test("handles single result", () => {
      const rawResponse = [["doc:1", "1.0", [["field", "value"]]]];

      const result = parseQueryResponse(rawResponse);

      expect(result).toEqual([
        {
          key: "doc:1",
          score: "1.0",
          fields: [{ field: "value" }],
        },
      ]);
    });
  });
});

describe("parseDescribeResponse", () => {
  test("returns the raw response as IndexDescription", () => {
    const rawResponse = {
      indexName: "test-index",
      dataType: "hash",
      prefixes: ["user:"],
      language: "english",
      fields: [
        { name: "name", type: "TEXT" },
        { name: "age", type: "U64", fast: true },
      ],
    };

    const result = parseDescribeResponse(rawResponse);

    expect(result).toEqual(rawResponse as IndexDescription);
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
