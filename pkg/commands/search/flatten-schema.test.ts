import { describe, test, expect } from "bun:test";
import { flattenSchema } from "./flatten-schema";

describe("flattenSchema", () => {
  test("should flatten simple field types", () => {
    const schema = {
      name: "TEXT",
      age: "U64",
      isActive: "BOOL",
    } as const;

    const result = flattenSchema(schema);

    expect(result).toEqual([
      { path: "name", type: "TEXT" },
      { path: "age", type: "U64" },
      { path: "isActive", type: "BOOL" },
    ]);
  });

  test("should flatten nested objects with dot notation", () => {
    const schema = {
      name: "TEXT",
      nested: {
        score: "I64",
        isActive: "BOOL",
      },
    } as const;

    const result = flattenSchema(schema);

    expect(result).toEqual([
      { path: "name", type: "TEXT" },
      { path: "nested.score", type: "I64" },
      { path: "nested.isActive", type: "BOOL" },
    ]);
  });

  test("should handle deeply nested objects", () => {
    const schema = {
      name: "TEXT",
      nested: {
        score: "I64",
        tags: {
          type: {
            another: "TEXT",
          },
        },
      },
    } as const;

    const result = flattenSchema(schema);

    expect(result).toEqual([
      { path: "name", type: "TEXT" },
      { path: "nested.score", type: "I64" },
      { path: "nested.tags.type.another", type: "TEXT" },
    ]);
  });

  test("should handle detailed fields with options", () => {
    const schema = {
      name: {
        type: "TEXT",
        noTokenize: true,
      },
      age: {
        type: "U64",
        fast: true,
      },
    } as const;

    const result = flattenSchema(schema);

    expect(result).toEqual([
      { path: "name", type: "TEXT", noTokenize: true },
      { path: "age", type: "U64", fast: true },
    ]);
  });

  test("should handle nested objects with detailed fields", () => {
    const schema = {
      user: {
        name: {
          type: "TEXT",
          noStem: true,
        },
        age: "U64",
      },
      score: {
        type: "F64",
        fast: true,
      },
    } as const;

    const result = flattenSchema(schema);

    expect(result).toEqual([
      { path: "user.name", type: "TEXT", noStem: true },
      { path: "user.age", type: "U64" },
      { path: "score", type: "F64", fast: true },
    ]);
  });

  test("should handle all field types", () => {
    const schema = {
      text: "TEXT",
      u64: "U64",
      i64: "I64",
      f64: "F64",
      bool: "BOOL",
      date: "DATE",
    } as const;

    const result = flattenSchema(schema);

    expect(result).toEqual([
      { path: "text", type: "TEXT" },
      { path: "u64", type: "U64" },
      { path: "i64", type: "I64" },
      { path: "f64", type: "F64" },
      { path: "bool", type: "BOOL" },
      { path: "date", type: "DATE" },
    ]);
  });

  test("should handle complex mixed schema", () => {
    const schema = {
      name: "TEXT",
      age: "U64",
      profile: {
        bio: {
          type: "TEXT",
          noTokenize: true,
        },
        location: {
          city: "TEXT",
          coordinates: {
            lat: "F64",
            lng: "F64",
          },
        },
      },
      isActive: "BOOL",
    } as const;

    const result = flattenSchema(schema);

    expect(result).toEqual([
      { path: "name", type: "TEXT" },
      { path: "age", type: "U64" },
      { path: "profile.bio", type: "TEXT", noTokenize: true },
      { path: "profile.location.city", type: "TEXT" },
      { path: "profile.location.coordinates.lat", type: "F64" },
      { path: "profile.location.coordinates.lng", type: "F64" },
      { path: "isActive", type: "BOOL" },
    ]);
  });

  test("should handle empty schema", () => {
    const schema = {};

    const result = flattenSchema(schema);

    expect(result).toEqual([]);
  });

  test("should preserve all detailed field options", () => {
    const schema = {
      textField: {
        type: "TEXT",
        noTokenize: true,
        noStem: true,
      },
      numericField: {
        type: "I64",
        fast: true,
      },
    } as const;

    const result = flattenSchema(schema);

    expect(result).toEqual([
      {
        path: "textField",
        type: "TEXT",
        noTokenize: true,
        noStem: true,
      },
      {
        path: "numericField",
        type: "I64",
        fast: true,
      },
    ]);
  });
});
