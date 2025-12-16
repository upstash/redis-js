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
      name: "TEXT",
      age: { type: "U64", fast: true },
      isActive: "BOOL",
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

    expect(schema.name).toBe("TEXT");
    expect(schema.profile).toBeDefined();
    expect(schema.profile.age).toEqual({ type: "U64", fast: true });
    expect(schema.profile.city).toBe("TEXT");
  });

  test("supports all field types", () => {
    const schema = s.object({
      text: s.string().noStem(),
      unsignedInteger: s.number("U64"),
      integer: s.number("I64"),
      float: s.number("F64"),
      bool: s.boolean(),
      date: s.date(),
    });

    expect(schema).toEqual({
      text: { type: "TEXT", noStem: true },
      unsignedInteger: { type: "U64", fast: true },
      integer: { type: "I64", fast: true },
      float: { type: "F64", fast: true },
      bool: "BOOL",
      date: "DATE",
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

    expect(schema.name).toEqual("TEXT");
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
});
