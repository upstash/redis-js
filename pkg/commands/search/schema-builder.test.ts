import { describe, test, expect } from "bun:test";
import { s } from "./schema-builder";
import { createIndex } from "./search";

describe("Schema Builder", () => {
  test("builds simple hash schema", () => {
    const schema = s.hash({
      name: s.text(),
      age: s.unsignedInteger(),
      isActive: s.bool(),
    });

    expect(schema).toEqual({
      name: "TEXT",
      age: "U64",
      isActive: "BOOL",
    });
  });

  test("builds hash schema with field options", () => {
    const schema = s.hash({
      name: s.text().noTokenize(),
      age: s.unsignedInteger().fast(),
      score: s.float().fast(),
    });

    expect(schema).toEqual({
      name: { type: "TEXT", noTokenize: true },
      age: { type: "U64", fast: true },
      score: { type: "F64", fast: true },
    });
  });

  test("builds nested string schema", () => {
    const schema = s.object({
      name: s.text(),
      profile: s.object({
        age: s.unsignedInteger(),
        city: s.text(),
      }),
    });

    expect(schema.name).toBe("TEXT");
    expect(schema.profile).toBeDefined();
    expect(schema.profile.age).toBe("U64");
    expect(schema.profile.city).toBe("TEXT");
  });

  test("works with createIndex for hash", () => {
    const mockClient = {
      request: async () => ({ result: "OK" }),
    } as any;

    const schema = s.hash({
      name: s.text(),
      age: s.unsignedInteger(),
    });

    const index = createIndex({
      indexName: "users",
      schema,
      dataType: "hash",
      prefix: "user:",
      client: mockClient,
    });

    // Type test: hset should accept correct data
    index.hset("user:123", {
      name: "John", // Must be string
      age: 30, // Must be number
    });

    // TypeScript should error on wrong types:
    // @ts-expect-error - name must be string, not number
    index.hset("user:123", { name: 11, age: 30 });

    // @ts-expect-error - age must be number, not string
    index.hset("user:123", { name: "John", age: "30" });
  });

  test("works with createIndex for string/JSON", () => {
    const mockClient = {
      request: async () => ({ result: "OK" }),
    } as any;

    const schema = s.object({
      name: s.text(),
      profile: s.object({
        age: s.unsignedInteger(),
        city: s.text(),
      }),
    });

    const index = createIndex({
      indexName: "users",
      schema,
      dataType: "string",
      prefix: "user:",
      client: mockClient,
    });

    // Type test: set should accept correct nested data
    index.set("user:123", {
      name: "John",
      profile: {
        age: 30,
        city: "NYC",
      },
    });
  });

  test("supports all field types", () => {
    const schema = s.hash({
      text: s.text().noStem(),
      unsignedInteger: s.unsignedInteger(),
      integer: s.integer(),
      float: s.float(),
      bool: s.bool(),
      date: s.date(),
    });

    expect(schema).toEqual({
      text: { type: "TEXT", noStem: true },
      unsignedInteger: "U64",
      integer: "I64",
      float: "F64",
      bool: "BOOL",
      date: "DATE",
    });
  });

  test("supports chaining multiple options", () => {
    const schema = s.hash({
      title: s.text().noTokenize().noStem(),
      score: s.float().fast(),
    });

    expect(schema).toEqual({
      title: { type: "TEXT", noTokenize: true, noStem: true },
      score: { type: "F64", fast: true },
    });
  });

  test("returns precise types without options", () => {
    // Without options, should return literal types
    const schema = s.hash({
      name: s.text().noStem(), // Should be "TEXT", not union
      age: s.unsignedInteger(), // Should be "U64", not union
    });

    expect(schema.name).toEqual({ type: "TEXT", noStem: true });
    expect(schema.age).toEqual("U64");
  });

  test("returns detailed types with options", () => {
    // With options, should return object types
    const schema = s.hash({
      name: s.text().noTokenize(),
      age: s.unsignedInteger().fast(),
    });

    expect(schema.name).toEqual({ type: "TEXT", noTokenize: true });
    expect(schema.age).toEqual({ type: "U64", fast: true });
  });
});
