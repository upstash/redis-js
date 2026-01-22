"use server";

import { redis } from "@/lib/redis";
import { productSchema, Product, sampleProducts } from "@/lib/seed";
import { s } from "@upstash/redis";

type QueryFilter = Record<string, unknown>;
type QueryOptions = Record<string, unknown>;

export async function createStringIndex() {
  try {
    const index = await redis.search.createIndex({
      name: "products-idx",
      schema: productSchema,
      dataType: "string",
      prefix: "product:",
      language: "english",
      existsOk: true,
    });

    return {
      success: true,
      message: "String index created successfully!",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function insertSampleData() {
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
      success: true,
      message: `Inserted ${insertedCount} products and completed indexing`,
      count: insertedCount,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function checkIndexExists() {
  try {
    const index = redis.search.index({
      name: "products-idx",
      schema: productSchema,
    });
    
    const description = await index.describe();
    
    return {
      success: true,
      exists: true,
      description,
    };
  } catch (error) {
    return {
      success: true,
      exists: false,
    };
  }
}

export async function queryProducts(filter: QueryFilter) {
  try {
    const index = redis.search.index({
      name: "products-idx",
      schema: productSchema,
    });

    const results = await index.query({
      filter,
      limit: 10,
    });

    return {
      success: true,
      results: results.map((r: { key: string; score: string; data: Product }) => ({
        key: r.key,
        score: r.score,
        data: r.data,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function queryProductsWithOptions(filter: QueryFilter, options: QueryOptions = {}) {
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
      success: true,
      results: results.map((r: { key: string; score: string; data: Product }) => ({
        key: r.key,
        score: r.score,
        data: r.data,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function countProducts(filter: QueryFilter) {
  try {
    const index = redis.search.index({
      name: "products-idx",
      schema: productSchema,
    });

    const result = await index.count({ filter });

    return {
      success: true,
      count: result.count,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function describeIndex() {
  try {
    const index = redis.search.index({
      name: "products-idx",
      schema: productSchema,
    });

    const description = await index.describe();

    return {
      success: true,
      description,
      notFound: false,
    };
  } catch (error) {
    // Return success with notFound flag instead of error
    return {
      success: true,
      notFound: true,
      message: "Index does not exist",
    };
  }
}

export async function dropIndex() {
  try {
    const index = redis.search.index({
      name: "products-idx",
      schema: productSchema,
    });

    const result = await index.drop();

    return {
      success: true,
      result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
