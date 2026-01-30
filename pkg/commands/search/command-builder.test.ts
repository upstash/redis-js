import { describe, test, expect } from "bun:test";
import { buildQueryCommand, buildCreateIndexCommand } from "./command-builder";
import { s } from "./schema-builder";
import type { CreateIndexParameters } from "./search";

describe("buildQueryCommand", () => {
  type TestSchema = { name: "TEXT"; age: "U64" };

  describe("basic query", () => {
    test("builds simple query command", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
      });

      expect(command).toEqual(["SEARCH.QUERY", "test-index", '{"name":{"$eq":"John"}}']);
    });

    test("builds count command", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.COUNT", "test-index", {
        filter: { name: { $eq: "John" } },
      });

      expect(command).toEqual(["SEARCH.COUNT", "test-index", '{"name":{"$eq":"John"}}']);
    });
  });

  describe("with options", () => {
    test("adds LIMIT option", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        limit: 10,
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "LIMIT",
        "10",
      ]);
    });

    test("adds OFFSET option", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        offset: 5,
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "OFFSET",
        "5",
      ]);
    });

    test("adds NOCONTENT option", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        select: {},
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "NOCONTENT",
      ]);
    });

    test("adds ORDERBY option without direction", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        orderBy: { age: "ASC" },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "ORDERBY",
        "age",
        "ASC",
      ]);
    });

    test("adds ORDERBY option with ASC direction", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        orderBy: { age: "ASC" },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "ORDERBY",
        "age",
        "ASC",
      ]);
    });

    test("adds ORDERBY option with DESC direction", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        orderBy: { age: "DESC" },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "ORDERBY",
        "age",
        "DESC",
      ]);
    });

    test("adds HIGHLIGHT option with fields only", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        highlight: { fields: ["name"] },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "HIGHLIGHT",
        "FIELDS",
        "1",
        "name",
      ]);
    });

    test("adds HIGHLIGHT option with tags", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        highlight: { fields: ["name"], preTag: "<b>", postTag: "</b>" },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "HIGHLIGHT",
        "FIELDS",
        "1",
        "name",
        "TAGS",
        "<b>",
        "</b>",
      ]);
    });

    test("adds RETURN option with single field", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        select: { name: true },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "SELECT",
        "1",
        "name",
      ]);
    });

    test("adds RETURN option with multiple fields", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        select: { name: true, age: true },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "SELECT",
        "2",
        "name",
        "age",
      ]);
    });

    test("combines multiple options", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        limit: 10,
        offset: 5,
        orderBy: { age: "DESC" },
        select: { name: true, age: true },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "LIMIT",
        "10",
        "OFFSET",
        "5",
        "ORDERBY",
        "age",
        "DESC",
        "SELECT",
        "2",
        "name",
        "age",
      ]);
    });
  });

  describe("scoreFunc", () => {
    type TestSchemaWithScore = { name: "TEXT"; popularity: "U64"; recency: "U64" };

    test("builds query with simple scoreFunc", () => {
      const command = buildQueryCommand<TestSchemaWithScore>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "headphones" } },
        scoreFunc: "popularity",
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"headphones"}}',
        "SCOREFUNC",
        "FIELDVALUE",
        "popularity",
      ]);
    });

    test("builds query with scoreFunc and modifier", () => {
      const command = buildQueryCommand<TestSchemaWithScore>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "headphones" } },
        scoreFunc: {
          field: "popularity",
          modifier: "log1p",
          factor: 2,
        },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"headphones"}}',
        "SCOREFUNC",
        "FIELDVALUE",
        "popularity",
        "MODIFIER",
        "LOG1P",
        "FACTOR",
        "2",
      ]);
    });

    test("builds query with scoreFunc, modifier, and missing value", () => {
      const command = buildQueryCommand<TestSchemaWithScore>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "headphones" } },
        scoreFunc: {
          field: "popularity",
          modifier: "log1p",
          missing: 1,
        },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"headphones"}}',
        "SCOREFUNC",
        "FIELDVALUE",
        "popularity",
        "MODIFIER",
        "LOG1P",
        "MISSING",
        "1",
      ]);
    });

    test("builds query with scoreFunc and scoreMode", () => {
      const command = buildQueryCommand<TestSchemaWithScore>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "headphones" } },
        scoreFunc: {
          field: "popularity",
          scoreMode: "replace",
        },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"headphones"}}',
        "SCOREFUNC",
        "SCOREMODE",
        "REPLACE",
        "FIELDVALUE",
        "popularity",
      ]);
    });

    test("builds query with multiple field values", () => {
      const command = buildQueryCommand<TestSchemaWithScore>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "headphones" } },
        scoreFunc: {
          fields: [
            { field: "popularity", modifier: "log1p" },
            { field: "recency", modifier: "sqrt" },
          ],
          combineMode: "sum",
        },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"headphones"}}',
        "SCOREFUNC",
        "COMBINEMODE",
        "SUM",
        "FIELDVALUE",
        "popularity",
        "MODIFIER",
        "LOG1P",
        "FIELDVALUE",
        "recency",
        "MODIFIER",
        "SQRT",
      ]);
    });

    test("builds query with multiple field values and scoreMode", () => {
      const command = buildQueryCommand<TestSchemaWithScore>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "headphones" } },
        scoreFunc: {
          fields: ["popularity", "recency"],
          combineMode: "multiply",
          scoreMode: "sum",
        },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"headphones"}}',
        "SCOREFUNC",
        "COMBINEMODE",
        "MULTIPLY",
        "SCOREMODE",
        "SUM",
        "FIELDVALUE",
        "popularity",
        "FIELDVALUE",
        "recency",
      ]);
    });
  });
});

describe("buildCreateIndexCommand", () => {
  describe("hash index", () => {
    test("builds simple hash index command", () => {
      const schema = s.object({
        name: s.string(),
        age: s.number("U64"),
      });

      const params = {
        name: "test-index",
        schema,
        dataType: "hash" as const,
        prefix: "user:",
        client: {} as any,
      };

      const command = buildCreateIndexCommand(params);

      expect(command).toEqual([
        "SEARCH.CREATE",
        "test-index",
        "ON",
        "HASH",
        "PREFIX",
        "1",
        "user:",
        "SCHEMA",
        "name",
        "TEXT",
        "age",
        "U64",
        "FAST",
      ]);
    });

    test("builds hash index with multiple prefixes", () => {
      const schema = s.object({
        name: s.string(),
      });

      const params = {
        name: "test-index",
        schema,
        dataType: "hash" as const,
        prefix: ["user:", "profile:"],
        client: {} as any,
      };

      const command = buildCreateIndexCommand(params);

      expect(command).toEqual([
        "SEARCH.CREATE",
        "test-index",
        "ON",
        "HASH",
        "PREFIX",
        "2",
        "user:",
        "profile:",
        "SCHEMA",
        "name",
        "TEXT",
      ]);
    });

    test("builds hash index with field options", () => {
      const schema = s.object({
        name: s.string().noTokenize().noStem(),
        age: s.number("U64"),
      });

      const params = {
        name: "test-index",
        schema,
        dataType: "hash" as const,
        prefix: "user:",
        client: {} as any,
      };

      const command = buildCreateIndexCommand(params);

      expect(command).toEqual([
        "SEARCH.CREATE",
        "test-index",
        "ON",
        "HASH",
        "PREFIX",
        "1",
        "user:",
        "SCHEMA",
        "name",
        "TEXT",
        "NOTOKENIZE",
        "NOSTEM",
        "age",
        "U64",
        "FAST",
      ]);
    });

    test("builds hash index with language option", () => {
      const schema = s.object({
        name: s.string(),
      });

      const params = {
        name: "test-index",
        schema,
        dataType: "hash" as const,
        prefix: "user:",
        language: "turkish" as const,
        client: {} as any,
      };

      const command = buildCreateIndexCommand(params);

      expect(command).toEqual([
        "SEARCH.CREATE",
        "test-index",
        "ON",
        "HASH",
        "PREFIX",
        "1",
        "user:",
        "LANGUAGE",
        "turkish",
        "SCHEMA",
        "name",
        "TEXT",
      ]);
    });
  });

  describe("string/JSON index", () => {
    test("builds nested string index command", () => {
      const schema = s.object({
        name: s.string(),
        profile: s.object({
          age: s.number("U64"),
          city: s.string(),
        }),
      });

      const params = {
        name: "test-index",
        schema,
        dataType: "string" as const,
        prefix: "user:",
        client: {} as any,
      };

      const command = buildCreateIndexCommand(params);

      expect(command).toEqual([
        "SEARCH.CREATE",
        "test-index",
        "ON",
        "STRING",
        "PREFIX",
        "1",
        "user:",
        "SCHEMA",
        "name",
        "TEXT",
        "profile.age",
        "U64",
        "FAST",
        "profile.city",
        "TEXT",
      ]);
    });

    test("builds deeply nested string index command", () => {
      const schema = s.object({
        data: s.object({
          metadata: s.object({
            tags: s.string(),
          }),
        }),
      });

      const params = {
        name: "test-index",
        schema,
        dataType: "string" as const,
        prefix: "doc:",
        client: {} as any,
      };

      const command = buildCreateIndexCommand(params);

      expect(command).toEqual([
        "SEARCH.CREATE",
        "test-index",
        "ON",
        "STRING",
        "PREFIX",
        "1",
        "doc:",
        "SCHEMA",
        "data.metadata.tags",
        "TEXT",
      ]);
    });
  });

  describe("all field types", () => {
    test("builds index with all field types", () => {
      const schema = s.object({
        title: s.string(),
        count: s.number("U64"),
        value: s.number("I64"),
        score: s.number("F64"),
        active: s.boolean(),
        createdAt: s.date(),
      });

      const params = {
        name: "test-index",
        schema,
        dataType: "hash" as const,
        prefix: "item:",
        client: {} as any,
      };

      const command = buildCreateIndexCommand(params);

      expect(command).toEqual([
        "SEARCH.CREATE",
        "test-index",
        "ON",
        "HASH",
        "PREFIX",
        "1",
        "item:",
        "SCHEMA",
        "title",
        "TEXT",
        "count",
        "U64",
        "FAST",
        "value",
        "I64",
        "FAST",
        "score",
        "F64",
        "FAST",
        "active",
        "BOOL",
        "createdAt",
        "DATE",
      ]);
    });
  });

  describe("options", () => {
    test("builds index with skip initial scan and exists ok", () => {
      const schema = s.object({
        data: s.object({
          metadata: s.object({
            tags: s.string(),
          }),
        }),
      });

      const params: CreateIndexParameters<typeof schema> = {
        name: "test-index",
        schema,
        dataType: "string" as const,
        prefix: "doc:",
        existsOk: true,
        skipInitialScan: true,
        language: "english" as const,
      };

      const command = buildCreateIndexCommand(params);

      expect(command).toEqual([
        "SEARCH.CREATE",
        "test-index",
        "SKIPINITIALSCAN",
        "EXISTSOK",
        "ON",
        "STRING",
        "PREFIX",
        "1",
        "doc:",
        "LANGUAGE",
        "english",
        "SCHEMA",
        "data.metadata.tags",
        "TEXT",
      ]);
    });
  });
});
