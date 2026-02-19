import { describe, test, expect } from "bun:test";
import { s } from "./schema-builder";

describe("Schema Builder", () => {
  test("builds simple hash schema", () => {
    const schema = s.object({
      name: s.string(),
      age: s.number("U64"),
      isActive: s.boolean(),
    });

    expect(schema).toEqual({
      name: { type: "TEXT" },
      age: { type: "U64", fast: true },
      isActive: { type: "BOOL" },
    });
  });

  test("builds hash schema with field options", () => {
    const schema = s.object({
      name: s.string().noTokenize(),
      age: s.number("U64"),
      score: s.number("F64"),
    });

    expect(schema).toEqual({
      name: { type: "TEXT", noTokenize: true },
      age: { type: "U64", fast: true },
      score: { type: "F64", fast: true },
    });
  });

  test("builds nested string schema", () => {
    const schema = s.object({
      name: s.string(),
      profile: s.object({
        age: s.number("U64"),
        city: s.string(),
      }),
    });

    expect(schema.name).toEqual({ type: "TEXT" });
    expect(schema.profile).toBeDefined();
    expect(schema.profile.age).toEqual({ type: "U64", fast: true });
    expect(schema.profile.city).toEqual({ type: "TEXT" });
  });

  test("supports all field types", () => {
    const schema = s.object({
      text: s.string().noStem(),
      unsignedInteger: s.number("U64"),
      integer: s.number("I64"),
      float: s.number("F64"),
      bool: s.boolean(),
      date: s.date(),
      tag: s.keyword(),
    });

    expect(schema).toEqual({
      text: { type: "TEXT", noStem: true },
      unsignedInteger: { type: "U64", fast: true },
      integer: { type: "I64", fast: true },
      float: { type: "F64", fast: true },
      bool: { type: "BOOL" },
      date: { type: "DATE" },
      tag: { type: "KEYWORD" },
    });
  });

  test("supports chaining multiple options", () => {
    const schema = s.object({
      title: s.string().noTokenize().noStem(),
      score: s.number("F64"),
    });

    expect(schema).toEqual({
      title: { type: "TEXT", noTokenize: true, noStem: true },
      score: { type: "F64", fast: true },
    });
  });

  test("returns precise types without options", () => {
    // Without options, should return literal types
    const schema = s.object({
      name: s.string(), // Should be "TEXT", not union
      age: s.number("U64"), // Should be { type: "U64", fast: true }
    });

    expect(schema.name).toEqual({ type: "TEXT" });
    expect(schema.age).toEqual({ type: "U64", fast: true });
  });

  test("returns detailed types with options", () => {
    // With options, should return object types
    const schema = s.object({
      name: s.string().noTokenize(),
      age: s.number("U64"),
    });

    expect(schema.name).toEqual({ type: "TEXT", noTokenize: true });
    expect(schema.age).toEqual({ type: "U64", fast: true });
  });

  test("should support 'from' option in fields", () => {
    const schema = s.object({
      title: s.string(),
      titleExact: s.string().noStem().from("title"),
      count: s.number("U64"),
      countCopy: s.number("U64").from("count"),
      active: s.boolean(),
      activeCopy: s.boolean().from("active"),
      created: s.date(),
      createdCopy: s.date().from("created"),
    });

    expect(schema).toEqual({
      title: { type: "TEXT" },
      titleExact: { type: "TEXT", noStem: true, from: "title" },
      count: { type: "U64", fast: true },
      countCopy: { type: "U64", fast: true, from: "count" },
      active: { type: "BOOL" },
      activeCopy: { type: "BOOL", from: "active" },
      created: { type: "DATE" },
      createdCopy: { type: "DATE", from: "created" },
    });
  });
});
