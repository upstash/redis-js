"use client";

import { StepConfig } from "@/types/step";
import { QueryResult } from "@/components/query-result";
import { ProductCard } from "@/components/product-card";
import { queryProducts, createStringIndex, insertSampleData, checkIndexExists } from "@/server/actions";

export const createIndexSteps: StepConfig[] = [
  {
    title: "Schema Definition with 's' Syntax",
    description: (
      <>
        Redis Search uses a type-safe schema builder called <code>s</code> to define your index structure.
        It supports various field types including strings, numbers (F64, U64, I64), booleans, and dates.
      </>
    ),
    code: `import { s } from "@upstash/redis";

// Define your schema
const productSchema = s.object({
  name: s.string(),              // Text field
  description: s.string(),       // Text field
  category: s.string().noTokenize(), // Exact match only
  price: s.number("F64"),        // Float64 number
  stock: s.number("U64"),        // Unsigned 64-bit integer
  active: s.boolean(),           // Boolean field
  tags: s.string(),              // Text field
});`,
  },
  {
    title: "Creating an Index with Hash Data Type",
    description: (
      <>
        You can create an index using Hash data type for flat structures. Hash indexes are simple and efficient
        but don't support nested objects.
      </>
    ),
    code: `// For Hash data type (flat structure only)
const flatSchema = s.object({
  name: s.string(),
  price: s.number("F64"),
});

const hashIndex = await redis.search.createIndex({
  name: "hash-products-idx",
  schema: flatSchema,
  dataType: "hash",          // Redis Hash
  prefix: "hashprod:",
  existsOk: true,
});`,
  },
  {
    title: "Creating an Index with String Data Type",
    description: (
      <>
        String data type stores JSON as serialized strings. It supports nested schemas and is used in this demo.
        This is efficient and supports all JSON features.
      </>
    ),
    code: `// For String data type (JSON as string, supports nesting)
const index = await redis.search.createIndex({
  name: "products-idx",
  schema: productSchema,
  dataType: "string",        // Serialized JSON string
  prefix: "product:",
  language: "english",       // Optional: for text stemming
  existsOk: true,           // Don't error if exists
});`,
    result: (
      <QueryResult
        onQuery={createStringIndex}
        renderResults={(data) => (
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              ✅ {data.message}
            </p>
          </div>
        )}
      />
    ),
  },
  {
    title: "Creating an Index with JSON Data Type",
    description: (
      <>
        JSON data type uses Redis native JSON storage. It also supports nested schemas and provides
        powerful querying on complex JSON structures.
      </>
    ),
    code: `// For JSON data type (native JSON, supports nesting)
const nestedSchema = s.object({
  title: s.string(),
  metadata: s.object({       // Nested object
    author: s.string(),
    views: s.number("U64"),
  }),
});

const jsonIndex = await redis.search.createIndex({
  name: "posts-idx",
  schema: nestedSchema,
  dataType: "json",          // Redis JSON
  prefix: "post:",
});`,
  },
  {
    title: "Initializing an Existing Index",
    description: (
      <>
        If an index already exists, you can initialize a client without creating it.
        This is useful when you want to query an index that was created elsewhere.
      </>
    ),
    result: (
      <QueryResult
        onQuery={checkIndexExists}
        renderResults={(data) => (
          <div className={`rounded-lg border p-4 ${
            data.exists 
              ? "bg-green-500/10 border-green-500/20" 
              : "bg-yellow-500/10 border-yellow-500/20"
          }`}>
            <p className={`text-sm font-medium ${
              data.exists 
                ? "text-green-600 dark:text-green-400" 
                : "text-yellow-600 dark:text-yellow-400"
            }`}>
              {data.exists 
                ? "✅ Index 'products-idx' exists and is ready to use!" 
                : "⚠️ Index 'products-idx' does not exist yet. Create it first!"}
            </p>
            {data.exists && data.description && (
              <div className="mt-2 text-xs text-muted-foreground">
                Data type: {data.description.dataType} | Prefix: {data.description.prefixes.join(", ")}
              </div>
            )}
          </div>
        )}
      />
    ),
    code: `import { Redis } from "@upstash/redis";

// Initialize without creating
const index = redis.search.index({
  name: "products-idx",
  schema: productSchema,  // Optional: for type safety
});

// Or without schema
const indexNoSchema = redis.search.index({
  name: "products-idx"
});`,
  },
  {
    title: "Adding Data Using Regular Redis Commands",
    description: (
      <>
        Data is added using standard Redis commands. The index automatically picks up data with matching prefixes.
        For string indexes, serialize as JSON. For hash indexes, use HSET.
      </>
    ),
    code: `// For String data type (used in this demo)
await redis.set("product:1", JSON.stringify({
  name: "MacBook Pro 16",
  description: "Powerful laptop",
  category: "laptops",
  price: 2499.99,
  stock: 25,
  active: true,
  tags: "apple mac professional",
}));

// For JSON data type
await redis.json.set("product:2", "$", {
  name: "Dell XPS 15",
  price: 1899.99,
  // ... rest of data
});

// For Hash data type
await redis.hset("hashprod:1", {
  name: "Mouse",
  price: 99.99,
});`,
    result: (
      <QueryResult
        onQuery={insertSampleData}
        renderResults={(data) => (
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              ✅ {data.message}
            </p>
            {data.count && (
              <p className="text-xs text-muted-foreground mt-1">
                Total products: {data.count}
              </p>
            )}
          </div>
        )}
      />
    ),
  },
  {
    title: "Wait for Indexing",
    description: (
      <>
        After inserting data, use <code>waitIndexing()</code> to ensure all data is indexed before querying.
        This is especially important after bulk inserts.
      </>
    ),
    code: `// Wait for indexing to complete
await index.waitIndexing();

console.log("✅ Indexing completed");`,
    result: (
      <QueryResult
        onQuery={async () => {
          const result = await queryProducts({ active: true });
          return result;
        }}
        renderResults={(data) => (
          <div className="space-y-3">
            <div className="text-sm font-medium">
              Searched and found {data.results?.length || 0} active products
            </div>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {data.results?.map((item: any, idx: number) => (
                <ProductCard
                  key={idx}
                  product={item.data}
                  score={item.score}
                  showKey={true}
                />
              ))}
            </div>
          </div>
        )}
      />
    ),
  },
];
