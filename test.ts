// Allowed field types
type AllowedTypes = "TEXT" | "NUMBER" | "BOOL" | "DATE";

// Extract all keys from a schema type recursively, including nested paths
type SchemaPaths<T, Prefix extends string = ""> = {
  [K in keyof T]: K extends string
    ? T[K] extends { type: AllowedTypes }
      ? Prefix extends ""
        ? K
        : `${Prefix}${K}`
      : T[K] extends object
        ? SchemaPaths<T[K], `${Prefix}${K}.`>
        : never
    : never;
}[keyof T];

// Field definition - only the actual field, not nested objects
type FieldDef<TSchema> =
  | { type: AllowedTypes }
  | { type: AllowedTypes; from: SchemaPaths<TSchema> };

// Schema value can be a field or nested object containing more schema values
type SchemaValue<TSchema> = FieldDef<TSchema> | { [K: string]: SchemaValue<TSchema> };

// Helper function to define and validate schema
function defineSchema<const T>(schema: T & { [K in keyof T]: SchemaValue<T> }): T {
  return schema;
}

// Usage - fully generic, no explicit type needed
const schema = defineSchema({
  name: { type: "TEXT" },
  age: { type: "NUMBER" },
  nested: {
    otherAge: { type: "NUMBER" },
  },
  other: {
    ageExact: { type: "NUMBER", from: "nested.otherAge" }, // ✓ valid with autocomplete
    // invalid: { type: "NUMBER", from: "nonexistent" }, // ✗ error
  },
});
