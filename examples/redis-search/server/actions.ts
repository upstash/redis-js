"use server";

import { redis } from "@/lib/redis";
import { productSchema, ProductQueryResponseItem, sampleProducts } from "@/lib/seed";
import { QueryResponse } from "@/components/query-result";

type QueryFilter = Record<string, unknown>;
type QueryOptions = Record<string, unknown>;

export async function createStringIndex(): Promise<QueryResponse> {
  try {
    await redis.search.createIndex({
      name: "products-idx",
      schema: productSchema,
      dataType: "string",
      prefix: "product:",
      language: "english",
      existsOk: true,
    });

    return {
      type: "message",
      message: "String index created successfully!",
    };
  } catch (error) {
    return {
      type: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function insertSampleData(): Promise<QueryResponse> {
  try {
    let insertedCount = 0;

    const pipeline = redis.pipeline();
    
    for (let i = 0; i < sampleProducts.length; i++) {
      const product = sampleProducts[i];
      const key = `product:${i + 1}`;
      pipeline.set(key, JSON.stringify(product));
      insertedCount++;
    }

    await pipeline.exec();

    const index = redis.search.index({
      name: "products-idx",
      schema: productSchema,
    });
    
    await index.waitIndexing();

    return {
      type: "message",
      message: `Inserted ${insertedCount} products and completed indexing`,
      count: insertedCount,
    };
  } catch (error) {
    return {
      type: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function checkIndexExists(): Promise<QueryResponse> {
  try {
    const index = redis.search.index({
      name: "products-idx",
      schema: productSchema,
    });
    
    const description = await index.describe();
    
    return {
      type: "indexStatus",
      exists: true,
      description,
    };
  } catch {
    return {
      type: "indexStatus",
      exists: false,
    };
  }
}

export async function queryProducts(filter: QueryFilter): Promise<QueryResponse> {
  try {
    const index = redis.search.index({
      name: "products-idx",
      schema: productSchema,
    });

    const results = await index.query({
      filter,
      limit: 10,
    });

    console.log(results);
    

    return {
      type: "queryResponse",
      results: results as ProductQueryResponseItem[],
    };
  } catch (error) {
    return {
      type: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function queryProductsWithOptions(
  filter: QueryFilter,
  options: QueryOptions = {}
): Promise<QueryResponse> {
  try {
    const index = redis.search.index({
      name: "products-idx",
      schema: productSchema,
    });

    const results = await index.query({
      filter,
      ...options,
    });

    return {
      type: "queryResponse",
      results: results as ProductQueryResponseItem[],
      highlighted: !!options.highlight,
    };
  } catch (error) {
    return {
      type: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function countProducts(filter: QueryFilter): Promise<QueryResponse> {
  try {
    const index = redis.search.index({
      name: "products-idx",
      schema: productSchema,
    });

    const result = await index.count({ filter });

    return {
      type: "count",
      count: result.count,
    };
  } catch (error) {
    return {
      type: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function describeIndex(): Promise<QueryResponse> {
  try {
    const index = redis.search.index({
      name: "products-idx",
      schema: productSchema,
    });

    const description = await index.describe();

    return {
      type: "indexStatus",
      exists: true,
      description,
    };
  } catch {
    // Return success with notFound flag instead of error
    return {
      type: "indexStatus",
      exists: false,
    };
  }
}

export async function dropIndex(): Promise<QueryResponse> {
  try {
    const index = redis.search.index({
      name: "products-idx",
      schema: productSchema,
    });

    const result = await index.drop();

    return {
      type: "message",
      message: `Index dropped successfully: ${result}`,
    };
  } catch {
    return {
      type: "error",
      error: "Failed to drop index",
    };
  }
}
