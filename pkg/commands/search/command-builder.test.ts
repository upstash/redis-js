import { describe, test, expect } from "bun:test";
import { buildQueryCommand, buildCreateIndexCommand } from "./command-builder";
import { s } from "./schema-builder";

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

    test("adds SORTBY option without direction", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        orderBy: { age: "ASC" },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "SORTBY",
        "age",
        "ASC",
      ]);
    });

    test("adds SORTBY option with ASC direction", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        orderBy: { age: "ASC" },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "SORTBY",
        "age",
        "ASC",
      ]);
    });

    test("adds SORTBY option with DESC direction", () => {
      const command = buildQueryCommand<TestSchema>("SEARCH.QUERY", "test-index", {
        filter: { name: { $eq: "John" } },
        orderBy: { age: "DESC" },
      });

      expect(command).toEqual([
        "SEARCH.QUERY",
        "test-index",
        '{"name":{"$eq":"John"}}',
        "SORTBY",
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
        "RETURN",
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
        "RETURN",
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
        "SORTBY",
        "age",
        "DESC",
        "RETURN",
        "2",
        "name",
        "age",
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

      const props = {
        name: "test-index",
        schema,
        dataType: "hash" as const,
        prefix: "user:",
        client: {} as any,
      };

      const command = buildCreateIndexCommand(props);

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

      const props = {
        name: "test-index",
        schema,
        dataType: "hash" as const,
        prefix: ["user:", "profile:"],
        client: {} as any,
      };

      const command = buildCreateIndexCommand(props);

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

      const props = {
        name: "test-index",
        schema,
        dataType: "hash" as const,
        prefix: "user:",
        client: {} as any,
      };

      const command = buildCreateIndexCommand(props);

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

      const props = {
        name: "test-index",
        schema,
        dataType: "hash" as const,
        prefix: "user:",
        language: "turkish" as const,
        client: {} as any,
      };

      const command = buildCreateIndexCommand(props);

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

      const props = {
        name: "test-index",
        schema,
        dataType: "string" as const,
        prefix: "user:",
        client: {} as any,
      };

      const command = buildCreateIndexCommand(props);

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

      const props = {
        name: "test-index",
        schema,
        dataType: "string" as const,
        prefix: "doc:",
        client: {} as any,
      };

      const command = buildCreateIndexCommand(props);

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

      const props = {
        name: "test-index",
        schema,
        dataType: "hash" as const,
        prefix: "item:",
        client: {} as any,
      };

      const command = buildCreateIndexCommand(props);

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
});
