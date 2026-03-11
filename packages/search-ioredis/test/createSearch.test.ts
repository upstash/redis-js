import { describe, test, expect, beforeAll, afterAll } from "vitest";
import IORedis from "ioredis";
import { createSearch, s } from "../src/index";

const schema = s.object({
  title: s.string(),
  price: s.number(),
  tag: s.keyword(),
  category: s.facet(),
});

describe("search e2e", () => {
  let ioredis: IORedis;
  let search: ReturnType<typeof createSearch>;
  const indexName = `test-idx-ioredis-${Date.now()}`;
  const prefix = `test:ioredis:${Date.now()}:`;

  beforeAll(() => {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error("REDIS_URL environment variable is required");
    }
    ioredis = new IORedis(redisUrl);
    search = createSearch(ioredis);
  });

  afterAll(async () => {
    const idx = search.index({ name: indexName, schema });
    await idx.drop().catch(() => {});
    await search.alias.delete({ alias: `alias-${indexName}` }).catch(() => {});
    await ioredis.quit();
  });

  test("createIndex, set data, waitIndexing, describe", async () => {
    const createResult = await search.createIndex({
      name: indexName,
      prefix,
      schema,
      dataType: "json",
    });
    expect(createResult).toBeDefined();

    const idx = search.index({ name: indexName, schema });

    const docs = [
      {
        id: "1",
        data: { title: "fiction book", price: 10, tag: "book", category: "/shop/books/fiction" },
      },
      {
        id: "2",
        data: {
          title: "nonfiction book",
          price: 20,
          tag: "book",
          category: "/shop/books/nonfiction",
        },
      },
      {
        id: "3",
        data: {
          title: "laptop computer",
          price: 80,
          tag: "electronics",
          category: "/shop/electronics/laptops",
        },
      },
      {
        id: "4",
        data: {
          title: "phone device",
          price: 60,
          tag: "electronics",
          category: "/shop/electronics/phones",
        },
      },
    ];

    for (const doc of docs) {
      await ioredis.call("JSON.SET", `${prefix}${doc.id}`, "$", JSON.stringify(doc.data));
    }

    const waitResult = await idx.waitIndexing();
    expect(typeof waitResult).toBe("number");

    const description = await idx.describe();
    expect(description).not.toBeNull();
  });

  test("query with text, keyword, and facet filters", async () => {
    const idx = search.index({ name: indexName, schema });

    const textResults = await idx.query({ filter: { title: { $eq: "fiction book" } } });
    expect(textResults.length).toBeGreaterThanOrEqual(1);

    const keywordResults = await idx.query({ filter: { tag: { $eq: "book" } } });
    expect(keywordResults.length).toBe(2);

    const facetResults = await idx.query({
      filter: { category: { $eq: "/shop/electronics/laptops" } },
    });
    expect(facetResults.length).toBe(1);
  });

  test("aggregate - metric aggregations ($avg, $sum, $min, $max, $count)", async () => {
    const idx = search.index({ name: indexName, schema });

    const avgResult = await idx.aggregate({
      aggregations: { avg_price: { $avg: { field: "price" } } },
    });
    expect(avgResult.avg_price.value).toBeDefined();

    const sumResult = await idx.aggregate({
      aggregations: { total: { $sum: { field: "price" } } },
    });
    expect(sumResult.total.value).toBeDefined();

    const minResult = await idx.aggregate({
      aggregations: { min_p: { $min: { field: "price" } } },
    });
    expect(minResult.min_p.value).toBeDefined();

    const maxResult = await idx.aggregate({
      aggregations: { max_p: { $max: { field: "price" } } },
    });
    expect(maxResult.max_p.value).toBeDefined();

    const countResult = await idx.aggregate({
      aggregations: { cnt: { $count: { field: "price" } } },
    });
    expect(countResult.cnt.value).toBeDefined();
  });

  test("aggregate - $stats and $extendedStats", async () => {
    const idx = search.index({ name: indexName, schema });

    const statsResult = await idx.aggregate({
      aggregations: { s: { $stats: { field: "price" } } },
    });
    expect(statsResult.s.count).toBeDefined();
    expect(statsResult.s.min).toBeDefined();
    expect(statsResult.s.max).toBeDefined();
    expect(statsResult.s.sum).toBeDefined();
    expect(statsResult.s.avg).toBeDefined();

    const extStatsResult = await idx.aggregate({
      aggregations: { es: { $extendedStats: { field: "price", sigma: 2 } } },
    });
    expect(extStatsResult.es.count).toBeDefined();
    expect(extStatsResult.es.variance).toBeDefined();
    expect(extStatsResult.es.stdDeviation).toBeDefined();
  });

  test("aggregate - $percentiles", async () => {
    const idx = search.index({ name: indexName, schema });

    const pctResult = await idx.aggregate({
      aggregations: { p: { $percentiles: { field: "price", percents: [50, 95] } } },
    });
    expect(pctResult.p.values).toBeDefined();
  });

  test("aggregate - bucket aggregations ($terms, $range, $histogram)", async () => {
    const idx = search.index({ name: indexName, schema });

    const termsResult = await idx.aggregate({
      aggregations: { by_tag: { $terms: { field: "tag", size: 10 } } },
    });
    expect(termsResult.by_tag.buckets).toBeDefined();
    expect(termsResult.by_tag.buckets.length).toBeGreaterThan(0);

    const rangeResult = await idx.aggregate({
      aggregations: {
        tiers: {
          $range: { field: "price", ranges: [{ to: 30 }, { from: 30, to: 70 }, { from: 70 }] },
        },
      },
    });
    expect(rangeResult.tiers.buckets).toBeDefined();

    const histResult = await idx.aggregate({
      aggregations: { h: { $histogram: { field: "price", interval: 30 } } },
    });
    expect(histResult.h.buckets).toBeDefined();
  });

  test("aggregate - $facet aggregation", async () => {
    const idx = search.index({ name: indexName, schema });

    const facetAggResult = await idx.aggregate({
      aggregations: {
        by_cat: {
          $facet: { field: "category", path: "/shop", depth: 1 },
        },
      },
    });
    expect(facetAggResult.by_cat).toBeDefined();
    expect((facetAggResult.by_cat as any).path).toBe("/shop");
  });

  test("aggregate - nested sub-aggregations and filter", async () => {
    const idx = search.index({ name: indexName, schema });

    const nestedResult = await idx.aggregate({
      aggregations: {
        by_tag: {
          $terms: { field: "tag" },
          $aggs: {
            avg_price: { $avg: { field: "price" } },
          },
        },
      },
    });
    expect(nestedResult.by_tag.buckets).toBeDefined();
    for (const bucket of nestedResult.by_tag.buckets as any[]) {
      expect(bucket.avg_price).toBeDefined();
    }

    const filteredAgg = await idx.aggregate({
      filter: { tag: { $eq: "book" } },
      aggregations: { avg_price: { $avg: { field: "price" } } },
    });
    expect(filteredAgg.avg_price.value).toBeDefined();
  });

  test("alias add, list, delete", async () => {
    const aliasName = `alias-${indexName}`;

    const addResult = await search.alias.add({ indexName, alias: aliasName });
    expect(addResult).toBeDefined();

    const aliases = await search.alias.list();
    expect(aliases).toBeDefined();
    expect(aliases[aliasName]).toBe(indexName);

    const delResult = await search.alias.delete({ alias: aliasName });
    expect(delResult).toBeDefined();
  });

  test("describe and query on non-existent index", async () => {
    const nonExistent = search.index({ name: "non-existent-index-xyz", schema });

    const descNull = await nonExistent.describe();
    expect(descNull).toBeNull();

    const emptyResults = await nonExistent.query({ filter: { title: { $eq: "test" } } });
    expect(emptyResults).toBeNull();
  });

  test("drop index", async () => {
    const idx = search.index({ name: indexName, schema });
    const dropResult = await idx.drop();
    expect(typeof dropResult).toBe("number");
  });
});
