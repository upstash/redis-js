# Upstash Redis Search - LLM Guide

This guide explains how to use Redis Search with the `@upstash/redis` SDK to build full-text search functionality.

## Installation

```bash
npm install @upstash/redis
```

## Redis Client Initialization

```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "<UPSTASH_REDIS_REST_URL>",
  token: "<UPSTASH_REDIS_REST_TOKEN>",
});
```

## Overview

Redis Search provides full-text search capabilities with:

- Type-safe schema definitions
- MongoDB-like query syntax
- Support for nested objects (JSON/String data types) and flat structures (Hash)
- Multiple field types: TEXT, U64, I64, F64, BOOL, DATE
- Fuzzy matching, phrase search, regex, and more
- Sorting, pagination, field selection, and highlighting

## Creating a Search Index

### Schema Builder

Use the `s` helper to build type-safe schemas:

```typescript
import { s } from "@upstash/redis";

// Simple schema
const schema = s.object({
  name: s.string(),
  price: s.number("F64"), // Float64 (default for numbers)
  stock: s.number("U64"), // Unsigned 64-bit integer
  quantity: s.number("I64"), // Signed 64-bit integer
  active: s.boolean(),
  createdAt: s.date(),
});

// Nested schema (JSON or String data types only)
const nestedSchema = s.object({
  title: s.string(),
  metadata: s.object({
    author: s.string(),
    views: s.number("U64"),
    rating: s.number("F64"),
  }),
});
```

### Field Options

**Text Fields:**

```typescript
s.string(); // Default text field
s.string().noTokenize(); // Don't split into tokens (exact match)
s.string().noStem(); // Don't apply stemming
s.string().noTokenize().noStem(); // Both options
```

**Numeric Fields (require `fast: true` for sorting):**

```typescript
s.number(); // F64 (default)
s.number("U64"); // Unsigned 64-bit integer
s.number("I64"); // Signed 64-bit integer
s.number("F64"); // Float 64-bit
```

**Boolean Fields:**

```typescript
s.boolean(); // Default boolean
s.boolean().fast(); // Enable fast mode for sorting
```

**Date Fields:**

```typescript
s.date(); // Default date
s.date().fast(); // Enable fast mode for sorting
```

**Field Aliasing (from option):**

```typescript
// Index a field from a different source field name
s.string().from("original_field_name");
s.number("U64").from("count");
```

### Creating an Index

```typescript
import { createIndex } from "@upstash/redis";

// For JSON data
const index = await redis.search.createIndex({
  name: "products-idx",
  schema: schema,
  dataType: "json",
  prefix: "product:", // or ["product:", "item:"] for multiple prefixes
  language: "english", // Optional: language for stemming
  skipInitialScan: false, // Optional: skip indexing existing data
  existsOk: true, // Optional: don't error if index exists
});

// For serialized JSON strings
const index = await redis.search.createIndex({
  name: "products-idx",
  schema: nestedSchema,
  dataType: "string",
  prefix: "product:",
});

// For Redis Hash data structures
const flatSchema = s.object({
  name: s.string(),
  price: s.number("F64"),
});

const hashIndex = await redis.search.createIndex({
  name: "hash-idx",
  schema: flatSchema,
  dataType: "hash",
  prefix: "user:",
});
```

**Data Types:**

- `"json"`: For JSON documents (supports nested schemas)
- `"string"`: For serialized JSON strings (supports nested schemas)
- `"hash"`: For Redis Hash structures (flat schemas only, no nesting)

## Initializing an Existing Index

If an index already exists, initialize it without creating:

```typescript
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// With schema (for type safety)
const index = redis.search.index({
  name: "products-idx",
  schema: schema,
});

// Without schema
const index = redis.search.index({ name: "products-idx" });
```

## Inserting Data

Data is inserted using standard Redis commands. The index automatically picks up data with matching prefixes.

**For JSON indexes:**

```typescript
await redis.json.set("product:1", "$", {
  name: "Laptop Pro",
  price: 1299.99,
  stock: 50,
  active: true,
  metadata: {
    author: "TechCorp",
    views: 1000,
  },
});
```

**For String indexes:**

```typescript
await redis.set(
  "product:1",
  JSON.stringify({
    name: "Laptop Pro",
    price: 1299.99,
    stock: 50,
  })
);
```

**For Hash indexes:**

```typescript
await redis.hset("user:1", {
  name: "John Doe",
  age: 30,
  city: "NYC",
});
```

**Wait for indexing to complete:**

```typescript
await index.waitIndexing();
```

## Querying

**Note on Shorthand Syntax:** For equality checks, you can use direct value assignment instead of `{ $eq: value }`. For example, `{ name: "Jack" }` is equivalent to `{ name: { $eq: "Jack" } }`. The shorthand syntax triggers a smart match in the backend to find the best possible matches.

### Basic Text Field Queries

```typescript
// Exact match (finds documents containing the word)
const results = await index.query({
  filter: { name: { $eq: "Laptop" } },
});

// Shorthand: Direct value (runs a complex filter in the backend that matches text as best as possible)
const results = await index.query({
  filter: { name: "Laptop" },
});

// Not equal
const results = await index.query({
  filter: { name: { $ne: "Laptop" } },
});

// In list
const results = await index.query({
  filter: { name: { $in: ["Laptop", "Desktop", "Tablet"] } },
});

// Fuzzy match (typo tolerance)
const results = await index.query({
  filter: { name: { $fuzzy: "Laptopp" } }, // Simple
});

const results = await index.query({
  filter: {
    name: {
      $fuzzy: {
        value: "Laptopp",
        distance: 2, // Levenshtein distance
        transpositionCostOne: true, // Optional
      },
    },
  },
});

// Phrase match (exact phrase)
const results = await index.query({
  filter: { description: { $phrase: "wireless mouse" } },
});

const results = await index.query({
  filter: {
    description: {
      $phrase: {
        value: "wireless mouse",
        prefix: true, // Allow prefix matching
      },
    },
  },
});

const results = await index.query({
  filter: {
    description: {
      $phrase: {
        value: "wireless mouse",
        slop: 2, // Allow 2 words between
      },
    },
  },
});

// Regex pattern
const results = await index.query({
  filter: { name: { $regex: "Laptop.*" } },
});
```

### Numeric Field Queries

```typescript
// Equal (shorthand)
const results = await index.query({
  filter: { price: 1299.99 },
});

// Greater than
const results = await index.query({
  filter: { price: { $gt: 500 } },
});

// Greater than or equal
const results = await index.query({
  filter: { price: { $gte: 500 } },
});

// Less than
const results = await index.query({
  filter: { price: { $lt: 1000 } },
});

// Less than or equal
const results = await index.query({
  filter: { price: { $lte: 1000 } },
});

// Equal
const results = await index.query({
  filter: { stock: { $eq: 50 } },
});

// Not equal
const results = await index.query({
  filter: { stock: { $ne: 0 } },
});

// In list
const results = await index.query({
  filter: { stock: { $in: [10, 20, 30] } },
});
```

### Boolean Field Queries

```typescript
// Equal (shorthand)
const results = await index.query({
  filter: { active: true },
});

// Equal (explicit)
const results = await index.query({
  filter: { active: { $eq: true } },
});

// Not equal
const results = await index.query({
  filter: { active: { $ne: false } },
});

// In list
const results = await index.query({
  filter: { active: { $in: [true] } },
});
```

### Date Field Queries

```typescript
// Date comparisons (accepts string or Date objects)
const results = await index.query({
  filter: { createdAt: { $gte: "2024-01-01" } },
});

const results = await index.query({
  filter: { createdAt: { $lt: new Date() } },
});

// Date range
const results = await index.query({
  filter: {
    createdAt: {
      $gte: "2024-01-01",
      $lte: "2024-12-31",
    },
  },
});
```

### Nested Field Queries

For JSON and String data types, query nested fields using dot notation:

```typescript
// Shorthand (smart match in backend)
const results = await index.query({
  filter: { "metadata.author": "John" },
});

// Explicit equality
const results = await index.query({
  filter: { "metadata.author": { $eq: "John" } },
});

const results = await index.query({
  filter: { "metadata.views": { $gte: 1000 } },
});

const results = await index.query({
  filter: {
    "profile.settings.theme": { $eq: "dark" },
  },
});
```

### Boolean Operators

**$and - All conditions must match:**

```typescript
const results = await index.query({
  filter: {
    $and: [{ name: { $eq: "Laptop" } }, { price: { $gt: 500 } }],
  },
});

// Or single object (implicit AND when mixing fields)
const results = await index.query({
  filter: {
    name: { $eq: "Laptop" },
    price: { $gt: 500 },
  },
});

// Shorthand with implicit AND
const results = await index.query({
  filter: {
    name: "Laptop",
    active: true,
    price: { $gt: 500 },
  },
});
```

**$or - At least one condition must match:**

```typescript
const results = await index.query({
  filter: {
    $or: [{ name: { $eq: "Laptop" } }, { name: { $eq: "Desktop" } }],
  },
});

// Note: $or cannot mix with field conditions at root level
// This is INVALID:
// { $or: [...], name: { $eq: "..." } }
```

**$must - All conditions must match (explicit):**

```typescript
const results = await index.query({
  filter: {
    $must: [{ name: { $eq: "Laptop" } }, { active: { $eq: true } }],
  },
});
```

**$should - At least one should match (scoring boost):**

```typescript
const results = await index.query({
  filter: {
    $should: [{ name: { $eq: "Laptop" } }, { name: { $eq: "Desktop" } }],
  },
});
```

**$mustNot - Conditions must NOT match:**

```typescript
const results = await index.query({
  filter: {
    $mustNot: [{ category: { $eq: "archived" } }],
  },
});
```

**Combining boolean operators:**

```typescript
// $must + $should
const results = await index.query({
  filter: {
    $must: [{ active: { $eq: true } }],
    $should: [{ category: { $eq: "electronics" } }, { category: { $eq: "computers" } }],
  },
});

// $must + $mustNot
const results = await index.query({
  filter: {
    $must: [{ active: { $eq: true } }],
    $mustNot: [{ category: { $eq: "archived" } }],
  },
});

// Full boolean query: $must + $should + $mustNot
const results = await index.query({
  filter: {
    $must: [{ active: { $eq: true } }],
    $should: [{ category: { $eq: "electronics" } }, { price: { $lt: 100 } }],
    $mustNot: [{ stock: { $eq: 0 } }],
  },
});

// You can also add field filters to any boolean operator
const results = await index.query({
  filter: {
    category: { $eq: "electronics" },
    $must: [{ active: { $eq: true } }],
    $should: [{ name: { $eq: "Laptop" } }, { name: { $eq: "Desktop" } }],
  },
});
```

### Boosting Scores

Apply boost to specific conditions:

```typescript
const results = await index.query({
  filter: {
    name: { $eq: "Laptop", $boost: 2.0 },
  },
});

const results = await index.query({
  filter: {
    $should: [{ name: { $eq: "Laptop", $boost: 2.0 } }, { name: { $eq: "Desktop", $boost: 1.0 } }],
  },
});

// Boost entire boolean clause
const results = await index.query({
  filter: {
    $or: [{ name: { $eq: "Laptop" } }, { name: { $eq: "Desktop" } }],
    $boost: 1.5,
  },
});
```

### Query Options

**Pagination:**

```typescript
const results = await index.query({
  filter: { category: { $eq: "electronics" } },
  limit: 10, // Maximum number of results
  offset: 20, // Skip first 20 results
});
```

**Sorting:**

```typescript
// Ascending
const results = await index.query({
  filter: { category: { $eq: "electronics" } },
  orderBy: { price: "ASC" },
});

// Descending
const results = await index.query({
  filter: { category: { $eq: "electronics" } },
  orderBy: { price: "DESC" },
});

// Note: Sorting requires numeric/boolean/date fields to have fast: true
// For numeric fields, fast is automatic. For bool/date, use .fast()
```

**Field Selection:**

```typescript
// Return specific fields only
const results = await index.query({
  filter: { category: { $eq: "electronics" } },
  select: { name: true, price: true },
});
// Results: [{ key: "...", score: "...", data: { name: "...", price: ... } }]

// Return no data (only keys and scores)
const results = await index.query({
  filter: { category: { $eq: "electronics" } },
  select: {},
});
// Results: [{ key: "...", score: "..." }]

// Return nested fields
const results = await index.query({
  filter: { "author.name": { $eq: "John" } },
  select: { "author.email": true, title: true },
});
```

**Highlighting:**

```typescript
// Basic highlighting
const results = await index.query({
  filter: { description: { $eq: "laptop" } },
  highlight: {
    fields: ["description"],
  },
});

// Custom tags
const results = await index.query({
  filter: { description: { $eq: "laptop" } },
  highlight: {
    fields: ["description", "name"],
    preTag: "<mark>",
    postTag: "</mark>",
  },
});
```

### Query Results

```typescript
const results = await index.query({
  filter: { name: { $eq: "Laptop" } },
});

// With full data (default)
// results: Array<{
//   key: string;        // Redis key
//   score: string;      // Search relevance score
//   data: {             // Full document data
//     name: string;
//     price: number;
//     ...
//   }
// }>

// With select
const results = await index.query({
  filter: { name: { $eq: "Laptop" } },
  select: { name: true },
});
// results: Array<{
//   key: string;
//   score: string;
//   data: { name: string }
// }>

// With select: {}
const results = await index.query({
  filter: { name: { $eq: "Laptop" } },
  select: {},
});
// results: Array<{
//   key: string;
//   score: string;
// }>
```

## Counting

Count matching documents without retrieving them:

```typescript
const result = await index.count({
  filter: { category: { $eq: "electronics" } },
});

console.log(result.count); // Number of matching documents
```

## Index Management

**Describe index:**

```typescript
const description = await index.describe();
// Returns: {
//   name: string;
//   dataType: "hash" | "string" | "json";
//   prefixes: string[];
//   language?: string;
//   schema: Record<string, DescribeFieldInfo>
// }
```

**Drop index:**

```typescript
const result = await index.drop();
// Returns: 1 (success) or 0 (failed)
```

## Complete Example

```typescript
import { Redis, s } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Define schema
const productSchema = s.object({
  name: s.string(),
  description: s.string(),
  category: s.string().noTokenize(),
  price: s.number("F64"),
  stock: s.number("U64"),
  active: s.boolean(),
  metadata: s.object({
    brand: s.string(),
    rating: s.number("F64"),
  }),
});

// Create index
const index = await redis.search.createIndex({
  name: "products",
  schema: productSchema,
  dataType: "json",
  prefix: "product:",
  language: "english",
});

// Add products
await redis.json.set("product:1", "$", {
  name: "Laptop Pro",
  description: "High performance laptop for professionals",
  category: "electronics",
  price: 1299.99,
  stock: 50,
  active: true,
  metadata: {
    brand: "TechCorp",
    rating: 4.5,
  },
});

await redis.json.set("product:2", "$", {
  name: "Wireless Mouse",
  description: "Ergonomic wireless mouse",
  category: "electronics",
  price: 29.99,
  stock: 200,
  active: true,
  metadata: {
    brand: "TechCorp",
    rating: 4.2,
  },
});

await index.waitIndexing();

// Search with complex filter
const results = await index.query({
  filter: {
    category: { $eq: "electronics" },
    active: { $eq: true },
    price: { $gte: 20, $lte: 2000 },
    $should: [
      { "metadata.brand": { $eq: "TechCorp", $boost: 1.5 } },
      { "metadata.rating": { $gte: 4.0 } },
    ],
  },
  orderBy: { price: "ASC" },
  limit: 10,
  select: { name: true, price: true, "metadata.rating": true },
});

console.log(results);
// [
//   {
//     key: "product:2",
//     score: "2.5",
//     data: { name: "Wireless Mouse", price: 29.99, metadata: { rating: 4.2 } }
//   },
//   {
//     key: "product:1",
//     score: "2.5",
//     data: { name: "Laptop Pro", price: 1299.99, metadata: { rating: 4.5 } }
//   }
// ]
```

## Type Safety

The SDK provides full TypeScript type safety:

```typescript
const schema = s.object({
  name: s.string(),
  age: s.number("U64"),
});

const index = await redis.search.createIndex({
  name: "users",
  schema,
  dataType: "json",
  prefix: "user:",
});

// TypeScript will enforce valid field names and types
const results = await index.query({
  filter: {
    name: { $eq: "John" }, // ✓ Valid
    age: { $gte: 18 }, // ✓ Valid
    // invalid: { $eq: "test" }   // ✗ TypeScript error
  },
});

// Result types are automatically inferred
// results: Array<{
//   key: string;
//   score: string;
//   data: { name: string; age: number }
// }>
```

## Best Practices

1. **Use appropriate data types**: Choose the right numeric type (U64, I64, F64) for your data
2. **Enable fast mode**: Use `.fast()` on boolean/date fields if you need to sort by them
3. **Use noTokenize**: For fields that should match exactly (e.g., category, status)
4. **Prefix conventions**: Use clear, consistent prefixes (e.g., "product:", "user:")
5. **Wait for indexing**: Always call `await index.waitIndexing()` after bulk inserts
6. **Field selection**: Use `select` to return only needed fields for better performance
7. **Pagination**: Use `limit` and `offset` for large result sets
8. **Schema typing**: Always define schemas for type safety and better autocomplete

## Common Patterns

**Category + Price Range:**

```typescript
const results = await index.query({
  filter: {
    category: { $eq: "electronics" },
    price: { $gte: 100, $lte: 1000 },
  },
  orderBy: { price: "ASC" },
  limit: 20,
});
```

**Search with Fuzzy Matching:**

```typescript
const results = await index.query({
  filter: {
    name: { $fuzzy: { value: userInput, distance: 2 } },
  },
  limit: 10,
});
```

**Active Items with Boosted Premium:**

```typescript
const results = await index.query({
  filter: {
    active: { $eq: true },
    $should: [{ premium: { $eq: true, $boost: 2.0 } }, { featured: { $eq: true, $boost: 1.5 } }],
  },
});
```

**Complex Boolean Query:**

```typescript
const results = await index.query({
  filter: {
    $must: [{ status: { $eq: "published" } }, { language: { $eq: "en" } }],
    $should: [{ trending: { $eq: true } }, { "metadata.views": { $gte: 1000 } }],
    $mustNot: [{ archived: { $eq: true } }],
  },
});
```

## Troubleshooting

**Index not finding data:**

- Ensure data keys match the prefix pattern
- Call `await index.waitIndexing()` after inserting data
- Verify index was created successfully

**TypeScript errors:**

- Ensure schema is defined with `s.object()`
- Check field names match schema exactly (including nested paths)
- Verify you're using the correct operators for field types

**Sorting not working:**

- Numeric fields automatically have fast mode enabled
- Boolean and date fields need `.fast()` explicitly
- Ensure you're using `orderBy` with a valid field path

**Nested queries failing:**

- Only JSON and String data types support nested schemas
- Use dot notation for nested field paths: "author.name"
- Hash data type only supports flat structures
