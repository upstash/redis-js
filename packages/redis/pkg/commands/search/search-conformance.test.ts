/**
 * Conformance tests: the search types must accept exactly what the server accepts.
 *
 * Every case runs against a live index.
 * - `valid` cases must succeed on the server and compile.
 * - `typeOnly` cases succeed on the server but do nothing useful, so the types reject them.
 * - `invalid` cases must fail on the server with the given message. A case marked
 *   `@ts-expect-error` must also be rejected by the types; `pnpm test:types` fails
 *   when the types start accepting it. Cases without the directive are rules the
 *   types cannot express, such as an empty `$in` array or a malformed regex.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { newHttpClient, randomID } from "../../test-utils";
import { DelCommand } from "../del";
import { JsonSetCommand } from "../json_set";
import { s } from "./schema-builder";
import type { InferFilterFromSchema, SearchIndex } from "./search";
import type { FlatIndexSchema } from "./types";
import { createIndex } from "./search";

const client = newHttpClient();
const name = `conformance-${randomID().slice(0, 8)}`;
const prefix = `${name}:`;

const schema = s.object({
  name: s.string(),
  sku: s.string().noTokenize(),
  description: s.hybrid(),
  category: s.keyword(),
  tags: s.facet(),
  price: s.number("F64"),
  stock: s.number("U64"),
  delta: s.number("I64"),
  active: s.boolean().fast(),
  featured: s.boolean(),
  createdAt: s.date().fast(),
  updatedAt: s.date(),
  details: s.object({ brand: s.keyword(), summary: s.hybrid() }),
});

const products = [
  {
    name: "Studio Headphones",
    sku: "SKU-1",
    description: "Over-ear headphones with active noise cancelling",
    category: "audio",
    tags: "/audio/headphones",
    price: 199,
    stock: 5,
    delta: -2,
    active: true,
    featured: true,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
    details: { brand: "sony", summary: "Big cans for the studio" },
  },
  {
    name: "Travel Earplugs",
    sku: "SKU-2",
    description: "Soft foam earplugs that keep airplane cabin sound out",
    category: "travel",
    tags: "/travel/comfort",
    price: 9,
    stock: 100,
    delta: 3,
    active: true,
    featured: false,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-02T00:00:00Z",
    details: { brand: "007", summary: "Sleep on a plane" },
  },
  {
    name: "Sport Earbuds",
    sku: "SKU-3",
    description: "Sweat-proof wireless earbuds for running",
    category: "sports",
    tags: "/audio/earbuds",
    price: 79.99,
    stock: 0,
    delta: 0,
    active: false,
    featured: false,
    createdAt: "2024-05-20T00:00:00Z",
    updatedAt: "2024-05-21T00:00:00Z",
    details: { brand: "42", summary: "Jogging music" },
  },
];

let index: SearchIndex<typeof schema>;
const terms = { c: { $terms: { field: "category" } } } as const;
const ann = { $ann: { field: "description", query: "headphones" } } as const;

beforeAll(async () => {
  index = await createIndex(client, { name, schema, dataType: "json", prefix });
  for (const [i, product] of products.entries()) {
    await new JsonSetCommand([`${prefix}${i}`, "$", product]).exec(client);
  }
  await index.waitIndexing();
});

afterAll(async () => {
  await index.drop();
  await new DelCommand(products.map((_, i) => `${prefix}${i}`) as [string, ...string[]]).exec(
    client
  );
});

const phrase = (value: string, options: { slop?: number; prefix?: boolean }) => ({
  value,
  ...options,
});

// prettier-ignore
const valid: Record<string, () => Promise<unknown>> = {
  // field operators
  "text smart match": () => index.query({ filter: { name: "headphones" } }),
  "text $eq": () => index.query({ filter: { name: { $eq: "headphones" } } }),
  "text $in": () => index.query({ filter: { name: { $in: ["headphones", "earbuds"] } } }),
  "text $fuzzy": () => index.query({ filter: { name: { $fuzzy: "hedphones" } } }),
  "text $fuzzy options": () => index.query({ filter: { name: { $fuzzy: { value: "hedphones", distance: 2, transpositionCostOne: true, prefix: true } } } }),
  "text $phrase": () => index.query({ filter: { description: { $phrase: "noise cancelling" } } }),
  "text $phrase slop": () => index.query({ filter: { description: { $phrase: { value: "active cancelling", slop: 1 } } } }),
  "text $phrase prefix": () => index.query({ filter: { description: { $phrase: { value: "noise canc", prefix: true } } } }),
  "text $regex": () => index.query({ filter: { name: { $regex: "head.*" } } }),
  "text $smart": () => index.query({ filter: { name: { $smart: "studio headphones" } } }),
  "text op with $boost": () => index.query({ filter: { name: { $eq: "headphones", $boost: 2 } } }),
  "noTokenize text $eq": () => index.query({ filter: { sku: "SKU-1" } }),
  "number value": () => index.query({ filter: { price: 199 } }),
  "number range": () => index.query({ filter: { price: { $gt: 10, $lt: 500 } } }),
  "number inclusive range": () => index.query({ filter: { stock: { $gte: 0, $lte: 5 } } }),
  "number $in": () => index.query({ filter: { delta: { $in: [-2, 3] } } }),
  "bool value": () => index.query({ filter: { active: true } }),
  "bool $eq": () => index.query({ filter: { featured: { $eq: false } } }),
  "date string range": () => index.query({ filter: { createdAt: { $gte: "2024-01-01T00:00:00Z" } } }),
  "date Date object": () => index.query({ filter: { createdAt: { $lt: new Date("2024-04-01T00:00:00Z") } } }),
  "keyword value": () => index.query({ filter: { category: "audio" } }),
  "keyword range": () => index.query({ filter: { category: { $gte: "a", $lt: "t" } } }),
  "keyword $in": () => index.query({ filter: { category: { $in: ["audio", "travel"] } } }),
  "facet $eq": () => index.query({ filter: { tags: { $eq: "/audio/headphones" } } }),
  "facet $in": () => index.query({ filter: { tags: { $in: ["/audio/headphones", "/travel/comfort"] } } }),
  "nested path": () => index.query({ filter: { "details.brand": "sony" } }),
  "hybrid field text op": () => index.query({ filter: { "details.summary": { $fuzzy: "studo" } } }),
  "two fields": () => index.query({ filter: { category: "audio", active: true } }),

  // boolean operators
  "$must array": () => index.query({ filter: { $must: [{ name: "headphones" }, { active: true }] } }),
  "$must object": () => index.query({ filter: { $must: { name: "headphones", active: true } } }),
  "$should": () => index.query({ filter: { $should: [{ name: "headphones" }, { name: "earbuds" }] } }),
  "$mustNot alone": () => index.query({ filter: { $mustNot: { category: "travel" } } }),
  "$must + $mustNot": () => index.query({ filter: { $must: { name: "headphones" }, $mustNot: { active: false } } }),
  "$must + $should": () => index.query({ filter: { $must: { active: true }, $should: { name: "studio" } } }),
  "$must + $should + $mustNot": () => index.query({ filter: { $must: { active: true }, $should: { name: "studio" }, $mustNot: { category: "travel" } } }),
  "$should + $mustNot": () => index.query({ filter: { $should: [{ name: "earbuds" }, { name: "earplugs" }], $mustNot: { active: false } } }),
  "$and + $mustNot": () => index.query({ filter: { $and: [{ active: true }], $mustNot: { category: "travel" } } }),
  "$or + $mustNot": () => index.query({ filter: { $or: [{ name: "earbuds" }, { name: "earplugs" }], $mustNot: { active: false } } }),
  "$and + $must": () => index.query({ filter: { $and: { active: true }, $must: { name: "headphones" } } }),
  "$or + $should": () => index.query({ filter: { $or: { name: "earbuds" }, $should: { name: "earplugs" } } }),
  "field next to $must": () => index.query({ filter: { category: "audio", $must: { active: true } } }),
  "field next to $mustNot": () => index.query({ filter: { active: true, $mustNot: { category: "travel" } } }),
  "$should with $boost": () => index.query({ filter: { $should: [{ name: "earbuds" }, { name: "earplugs" }], $boost: 2 } }),
  "$must + $should with $boost": () => index.query({ filter: { $must: { active: true }, $should: { name: "studio" }, $boost: 2 } }),
  "$boost query object": () => index.query({ filter: { $boost: { query: { name: "headphones" }, value: 3 }, $should: { name: "earbuds" } } }),
  "nested groups": () => index.query({ filter: { $must: [{ $should: [{ name: "earbuds" }, { name: "earplugs" }] }, { $mustNot: { category: "audio" } }] } }),
  "nested $and inside $or": () => index.query({ filter: { $or: [{ $and: [{ category: "audio" }, { active: true }] }, { price: { $lt: 10 } }] } }),
  "no filter": () => index.query(),
  "empty filter": () => index.query({ filter: {} }),

  // query options
  "select": () => index.query({ filter: { active: true }, select: { name: true, "details.brand": true } }),
  "select nothing": () => index.query({ filter: { active: true }, select: {} }),
  "highlight": () => index.query({ filter: { description: "noise" }, highlight: { fields: ["description"], preTag: "<b>", postTag: "</b>" } }),
  "limit and offset": () => index.query({ filter: { active: true }, limit: 1, offset: 1 }),
  "orderBy number": () => index.query({ filter: { active: true }, orderBy: { price: "DESC" } }),
  "orderBy U64": () => index.query({ orderBy: { stock: "ASC" } }),
  "orderBy fast date": () => index.query({ orderBy: { createdAt: "ASC" } }),
  "orderBy fast bool": () => index.query({ orderBy: { active: "ASC" } }),
  "scoreFunc field": () => index.query({ filter: { name: "earbuds" }, scoreFunc: "price" }),
  "scoreFunc options": () => index.query({ filter: { name: "earbuds" }, scoreFunc: { field: "stock", modifier: "log1p", factor: 2, missing: 1, scoreMode: "sum" } }),
  "scoreFunc multiple": () => index.query({ filter: { name: "earbuds" }, scoreFunc: { fields: [{ field: "price", modifier: "sqrt" }, "stock"], combineMode: "sum", scoreMode: "multiply" } }),

  // retrievers
  "$ann": () => index.query({ filter: ann }),
  "$ann options": () => index.query({ filter: { $ann: { field: "description", query: "flight", profile: "precise", filter: { price: { $lt: 100 } } } }, select: { name: true }, limit: 2 }),
  "$ann nested field": () => index.query({ filter: { $ann: { field: "details.summary", query: "airplane" } } }),
  "$standard root with orderBy": () => index.query({ filter: { $standard: { query: { active: true } } }, orderBy: { price: "ASC" } }),
  "$rrf plain + $ann": () => index.query({ filter: { $rrf: { retrievers: [{ description: "noise" }, ann] } } }),
  "$rrf weights": () => index.query({ filter: { $rrf: { retrievers: [{ $standard: { query: { description: "noise" }, weight: 2 } }, { $ann: { field: "description", query: "noise", weight: 0.5 } }], rankConstant: 30, window: 10 } }, limit: 5 }),
  "$rrf full-text only": () => index.query({ filter: { $rrf: { retrievers: [{ name: "earbuds" }, { description: "earplugs" }] } } }),
  "$rrf two $ann": () => index.query({ filter: { $rrf: { retrievers: [ann, { $ann: { field: "details.summary", query: "plane" } }] } } }),
  "$rrf highlight and scoreFunc": () => index.query({ filter: { $rrf: { retrievers: [{ description: "noise" }, ann] } }, highlight: { fields: ["description"] }, scoreFunc: "price" }),
  "$rrf paging": () => index.query({ filter: { $rrf: { retrievers: [{ description: "noise" }, ann], window: 3 } }, limit: 1, offset: 1 }),

  // count
  "count": () => index.count({ filter: { active: true } }),
  "count $must + $mustNot": () => index.count({ filter: { $must: { active: true }, $mustNot: { category: "travel" } } }),
  "count $standard": () => index.count({ filter: { $standard: { query: { active: true } } } }),
  "count $rrf": () => index.count({ filter: { $rrf: { retrievers: [{ name: "earbuds" }, { $standard: { query: { name: "earplugs" }, weight: 2 } }] } } }),

  // aggregations
  "agg $terms": () => index.aggregate({ aggregations: terms }),
  "agg $terms size": () => index.aggregate({ aggregations: { c: { $terms: { field: "category", size: 2 } } } }),
  "agg with filter": () => index.aggregate({ filter: { active: true }, aggregations: terms }),
  "agg with $must + $mustNot": () => index.aggregate({ filter: { $must: { active: true }, $mustNot: { category: "travel" } }, aggregations: terms }),
  "agg with $rrf": () => index.aggregate({ filter: { $rrf: { retrievers: [{ name: "earbuds" }, { name: "earplugs" }] } }, aggregations: terms }),
  "agg $terms on number": () => index.aggregate({ aggregations: { p: { $terms: { field: "stock" } } } }),
  "agg $range": () => index.aggregate({ aggregations: { p: { $range: { field: "price", ranges: [{ to: 50 }, { from: 50, to: 100 }, { from: 100 }] } } } }),
  "agg $histogram": () => index.aggregate({ aggregations: { p: { $histogram: { field: "price", interval: 50 } } } }),
  "agg $avg": () => index.aggregate({ aggregations: { p: { $avg: { field: "price" } } } }),
  "agg $sum $min $max": () => index.aggregate({ aggregations: { a: { $sum: { field: "stock" } }, b: { $min: { field: "delta" } }, c: { $max: { field: "price", missing: 0 } } } }),
  "agg $stats": () => index.aggregate({ aggregations: { p: { $stats: { field: "price" } } } }),
  "agg $extendedStats": () => index.aggregate({ aggregations: { p: { $extendedStats: { field: "price", sigma: 2 } } } }),
  "agg $percentiles": () => index.aggregate({ aggregations: { p: { $percentiles: { field: "price", percents: [50, 99] } } } }),
  "agg $count": () => index.aggregate({ aggregations: { p: { $count: { field: "category" } } } }),
  "agg $cardinality": () => index.aggregate({ aggregations: { p: { $cardinality: { field: "category" } } } }),
  "agg $facet": () => index.aggregate({ aggregations: { p: { $facet: { field: "tags", path: "/audio" } } } }),
  "agg sub-aggregations": () => index.aggregate({ aggregations: { c: { $terms: { field: "category" }, $aggs: { avg: { $avg: { field: "price" } } } } } }),
  "agg $stats on date": () => index.aggregate({ aggregations: { d: { $min: { field: "createdAt" } } } }),
  "agg $dateHistogram": () => index.aggregate({ aggregations: { d: { $dateHistogram: { field: "createdAt", fixedInterval: "30d" } } } }),
  "agg $composite": () => index.aggregate({ aggregations: { c: { $composite: { size: 10, sources: [{ category: { $terms: { field: "category" } } }, { price: { $histogram: { field: "price", interval: 50 } } }] } } } }),
  "agg $composite paging": async () => {
    const aggregations = { c: { $composite: { size: 2, sources: [{ category: { $terms: { field: "category" } } }, { price: { $histogram: { field: "price", interval: 50 } } }] } } } as const;
    const first = await index.aggregate({ aggregations });
    expect(first.c.afterKey).toEqual({ category: expect.any(String), price: expect.any(String) });
    const second = await index.aggregate({ aggregations: { c: { $composite: { ...aggregations.c.$composite, after: first.c.afterKey } } } });
    expect(second.c.buckets.length).toBeGreaterThan(0);
  },
  "agg $composite date source": () => index.aggregate({ aggregations: { c: { $composite: { sources: [{ month: { $dateHistogram: { field: "createdAt", calendarInterval: "month", order: "desc", missingBucket: true, missingOrder: "last" } } }] }, $aggs: { avg: { $avg: { field: "price" } } } } } }),
  "agg keyed $histogram": async () => {
    const result = await index.aggregate({ aggregations: { p: { $histogram: { field: "price", interval: 100, keyed: true } } } });
    expect(result.p.buckets["0"]?.docCount).toBe(2);
  },
  "agg keyed $dateHistogram": async () => {
    const result = await index.aggregate({ aggregations: { d: { $dateHistogram: { field: "createdAt", fixedInterval: "3650d", keyed: true } } } });
    expect(Object.values(result.d.buckets)[0]?.keyAsString).toEqual(expect.any(String));
  },
  "agg $dateHistogram options": () => index.aggregate({ aggregations: { d: { $dateHistogram: { field: "createdAt", fixedInterval: "30d", minDocCount: 1 }, $aggs: { s: { $sum: { field: "stock" } } } } } }),
  "agg $terms options": () => index.aggregate({ aggregations: { c: { $terms: { field: "category", size: 5, segmentSize: 10, showTermDocCountError: true, minDocCount: 1, order: { key: "asc" }, missing: "none", include: ["audio", "travel"], exclude: "sp.*" } } } }),
  "agg $terms on bool": async () => {
    const result = await index.aggregate({ aggregations: { a: { $terms: { field: "active" } } } });
    const key: number | undefined = result.a.buckets[0]?.key;
    expect(typeof key).toBe("number");
  },
  "agg $histogram options": () => index.aggregate({ aggregations: { p: { $histogram: { field: "price", interval: 50, offset: 5, minDocCount: 0, extendedBounds: { min: 0, max: 300 }, hardBounds: { min: 0, max: 1000 } } } } }),
  "agg keyed $range": () => index.aggregate({ aggregations: { p: { $range: { field: "price", keyed: true, ranges: [{ key: "cheap", to: 50 }, { key: "expensive", from: 50 }] } } } }),
  "agg $sum nullIfNoMatch": () => index.aggregate({ filter: { name: "nothing" }, aggregations: { s: { $sum: { field: "price", nullIfNoMatch: true } } } }),
  "agg $cardinality and $count missing": () => index.aggregate({ aggregations: { a: { $cardinality: { field: "category", missing: "none" } }, b: { $count: { field: "price", missing: 0 } } } }),
  "agg $facet order by path": () => index.aggregate({ aggregations: { f: { $facet: { field: "tags", path: "/", depth: 2, size: 5, minDocCount: 1, order: { path: "asc" } } } } }),
  "agg nested buckets": async () => {
    const result = await index.aggregate({ aggregations: { c: { $terms: { field: "category" }, $aggs: { p: { $histogram: { field: "price", interval: 100 } } } } } });
    expect(Array.isArray(result.c.buckets[0]?.p.buckets)).toBe(true);
  },

  "agg empty keyed buckets": async () => {
    const result = await index.aggregate({ filter: { name: "nothingmatches" }, aggregations: { h: { $histogram: { field: "price", interval: 100, keyed: true } }, c: { $terms: { field: "category" }, $aggs: { h: { $histogram: { field: "price", interval: 100, keyed: true } } } } } });
    expect(result.h.buckets).toEqual({});
    expect(result.c.buckets).toEqual([]);
  },

  // filters stored in variables
  "filter variable as const": () => {
    const filter = { $rrf: { retrievers: [{ description: "noise" }, { $ann: { field: "description", query: "noise" } }], window: 10 } } as const;
    return index.query({ filter, limit: 5 });
  },
  "readonly $in": () => index.query({ filter: { category: { $in: ["audio", "travel"] as const } } }),
  "filter typed with InferFilterFromSchema": () => {
    const filter: InferFilterFromSchema<typeof schema> = { name: "headphones" };
    return index.query({ filter, limit: 5, orderBy: { price: "ASC" }, highlight: { fields: ["name"] } });
  },
  // wrappers that forward optional values
  "forwarded optional options": () => {
    const search = (sort?: "ASC" | "DESC", score?: "price", preTag?: string, postTag?: string, distance = 1) =>
      index.query({
        filter: { name: { $fuzzy: { value: "headphone", distance } } },
        orderBy: sort ? { price: sort } : undefined,
        scoreFunc: score,
        highlight: { fields: ["name"], preTag, postTag },
      });
    return search(undefined, "price", "<b>", "</b>");
  },
  "forwarded field operators": () => {
    const range: { $gte?: number; $lte?: number } = { $lte: 500 };
    return index.query({ filter: { description: { $phrase: phrase("noise", { slop: 1 }) }, price: { $gt: 0, ...range } } });
  },
  "keyed as a boolean variable": async () => {
    const keyed: boolean = Math.random() < 2;
    const result = await index.aggregate({ aggregations: { h: { $histogram: { field: "price", interval: 100, keyed } } } });
    const buckets = Array.isArray(result.h.buckets) ? result.h.buckets : Object.values(result.h.buckets);
    expect(buckets.length).toBeGreaterThan(0);
  },
  "$sum nullIfNoMatch": async () => {
    const result = await index.aggregate({ filter: { name: "nothingmatches" }, aggregations: { s: { $sum: { field: "price", nullIfNoMatch: true } } } });
    const value: number | null = result.s.value;
    expect(value).toBeNull();
  },
  "float bucket keys are numbers": async () => {
    const result = await index.aggregate({ aggregations: { c: { $terms: { field: "category" }, $aggs: { p: { $terms: { field: "price" } } } }, p: { $terms: { field: "price" } } } });
    for (const bucket of [...result.p.buckets, ...result.c.buckets.flatMap((b) => b.p.buckets)]) {
      expect(typeof bucket.key).toBe("number");
    }
  },
  "FlatIndexSchema as the schema type": async () => {
    const flat = index as unknown as SearchIndex<FlatIndexSchema>;
    await flat.query({ filter: { name: "headphones" }, orderBy: { price: "ASC" }, highlight: { fields: ["name"] } });
    return flat.aggregate({ aggregations: { a: { $avg: { field: "price" } } } });
  },
  "KEYWORD bucket keys keep leading zeros": async () => {
    const result = await index.aggregate({ aggregations: { b: { $terms: { field: "details.brand" } }, c: { $composite: { sources: [{ b: { $terms: { field: "details.brand" } } }] } } } });
    expect(result.b.buckets.map((bucket) => bucket.key).sort()).toEqual(["007", "42", "sony"]);
    expect(result.c.buckets.map((bucket) => bucket.key.b).sort()).toEqual(["007", "42", "sony"]);
  },
};

// prettier-ignore
const invalid: Record<string, [() => Promise<unknown>, string]> = {
  // field operators
  // @ts-expect-error unknown field
  "unknown field": [() => index.query({ filter: { nope: "x" } }), "not found in schema"],
  // @ts-expect-error range on TEXT
  "range on TEXT": [() => index.query({ filter: { name: { $gt: "a" } } }), "Only KEYWORD"],
  // @ts-expect-error $phrase on number
  "$phrase on number": [() => index.query({ filter: { price: { $phrase: "1" } } }), "incompatible type"],
  // @ts-expect-error string for number
  "string for number": [() => index.query({ filter: { price: "199" } }), "incompatible type"],
  // @ts-expect-error number for bool
  "number for bool": [() => index.query({ filter: { active: 1 } }), "incompatible type"],
  "$phrase slop + prefix": [() => index.query({ filter: { description: { $phrase: { value: "noise", slop: 1, prefix: true } } } }), "both slop and prefix"],
  "$fuzzy distance 3": [() => index.query({ filter: { name: { $fuzzy: { value: "x", distance: 3 } } } }), "must be 0, 1, or 2"],
  "$gt + $gte": [() => index.query({ filter: { price: { $gt: 1, $gte: 2 } } }), "only one of $gt and $gte"],
  // @ts-expect-error field $boost alone
  "field $boost alone": [() => index.query({ filter: { name: { $boost: 2 } } }), "needs another key"],
  "$in empty": [() => index.query({ filter: { name: { $in: [] } } }), "non-empty array"],
  "invalid regex": [() => index.query({ filter: { name: { $regex: "(" } } }), "regex"],
  "invalid date string": [() => index.query({ filter: { createdAt: { $gt: "yesterday" } } }), "RFC 3339"],

  // boolean operators
  // @ts-expect-error $and + $or
  "$and + $or": [() => index.query({ filter: { $and: { active: true }, $or: { name: "x" } } }), "cannot be used on the same nested level"],
  "root $boost alone": [() => index.query({ filter: { $boost: 2 } }), "needs another key"],
  "$must empty": [() => index.query({ filter: { $must: [] } }), "non-empty array or object"],
  // @ts-expect-error unknown field in $must
  "unknown field in $must": [() => index.query({ filter: { $must: [{ nope: "x" }] } }), "not found in schema"],

  // retriever placement
  // @ts-expect-error retriever inside $must
  "retriever inside $must": [() => index.query({ filter: { $must: [ann] } }), "cannot be used inside a query"],
  // @ts-expect-error retriever in $ann filter
  "retriever in $ann filter": [() => index.query({ filter: { $ann: { field: "description", query: "x", filter: ann } } }), "cannot be used inside a query"],
  // @ts-expect-error retriever in $standard query
  "retriever in $standard query": [() => index.query({ filter: { $standard: { query: ann } } }), "cannot be used inside a query"],
  // @ts-expect-error nested $rrf
  "nested $rrf": [() => index.query({ filter: { $rrf: { retrievers: [{ name: "x" }, { $rrf: { retrievers: [{ name: "a" }, { name: "b" }] } }] } } }), "Nested $rrf"],
  // @ts-expect-error retriever with another key
  "retriever with another key": [() => index.query({ filter: { ...ann, name: "x" } }), "only key of its object"],

  // retriever parameters
  // @ts-expect-error $ann on TEXT
  "$ann on TEXT": [() => index.query({ filter: { $ann: { field: "name", query: "x" } } }), "is not a HYBRID field"],
  // @ts-expect-error $ann on TEXT next to a plain query
  "$ann on TEXT in $rrf": [() => index.query({ filter: { $rrf: { retrievers: [{ description: "x" }, { $ann: { field: "name", query: "x" } }] } } }), "is not a HYBRID field"],
  // @ts-expect-error bad profile
  "bad profile": [() => index.query({ filter: { $ann: { field: "description", query: "x", profile: "turbo" } } }), "'profile' must be one of"],
  // @ts-expect-error bad profile next to a plain query
  "bad profile in $rrf": [() => index.query({ filter: { $rrf: { retrievers: [{ description: "x" }, { $ann: { field: "description", query: "x", profile: "turbo" } }] } } }), "'profile' must be one of"],
  // @ts-expect-error unknown field in $ann filter
  "unknown field in $ann filter": [() => index.query({ filter: { $ann: { field: "description", query: "x", filter: { nope: 1 } } } }), "not found in schema"],
  // @ts-expect-error weight on root $ann
  "weight on root $ann": [() => index.query({ filter: { $ann: { field: "description", query: "x", weight: 2 } } }), "only valid for a retriever inside $rrf"],
  // @ts-expect-error weight on root $standard
  "weight on root $standard": [() => index.query({ filter: { $standard: { query: { name: "x" }, weight: 2 } } }), "only valid for a retriever inside $rrf"],
  "$ann empty query": [() => index.query({ filter: { $ann: { field: "description", query: "" } } }), "non-empty 'query'"],
  "$rrf one retriever": [() => index.query({ filter: { $rrf: { retrievers: [{ name: "x" }] } } }), "2 to 10 retrievers"],
  "$rrf negative weight": [() => index.query({ filter: { $rrf: { retrievers: [{ name: "x" }, { $standard: { query: { name: "y" }, weight: -1 } }] } } }), "greater than or equal to 0"],
  "limit over window": [() => index.query({ filter: { $rrf: { retrievers: [{ name: "x" }, { name: "y" }], window: 1 } }, limit: 2 }), "must not exceed the $rrf window"],

  // retriever options
  "orderBy with $ann": [() => index.query({ filter: ann, orderBy: { price: "ASC" } }), "ORDERBY cannot be used with $ann"],
  "orderBy with $rrf": [() => index.query({ filter: { $rrf: { retrievers: [{ name: "x" }, ann] } }, orderBy: { price: "ASC" } }), "ORDERBY cannot be used with $rrf"],
  "highlight with $ann": [() => index.query({ filter: ann, highlight: { fields: ["description"] } }), "HIGHLIGHT cannot be used with $ann"],
  "scoreFunc with $ann": [() => index.query({ filter: ann, scoreFunc: "price" }), "SCOREFUNC cannot be used with $ann"],
  // @ts-expect-error count with $ann
  "count with $ann": [() => index.count({ filter: ann }), "cannot be used with SEARCH.COUNT"],
  // @ts-expect-error count with $ann in $rrf
  "count with $ann in $rrf": [() => index.count({ filter: { $rrf: { retrievers: [{ name: "x" }, ann] } } }), "cannot be used with SEARCH.COUNT"],
  // @ts-expect-error aggregate with $ann
  "aggregate with $ann": [() => index.aggregate({ filter: ann, aggregations: terms }), "cannot be used with SEARCH.AGGREGATE"],
  // @ts-expect-error aggregate with $ann in $rrf
  "aggregate with $ann in $rrf": [() => index.aggregate({ filter: { $rrf: { retrievers: [{ name: "x" }, ann] } }, aggregations: terms }), "cannot be used with SEARCH.AGGREGATE"],

  // query options
  // @ts-expect-error orderBy TEXT
  "orderBy TEXT": [() => index.query({ orderBy: { name: "ASC" } }), "for order by"],
  // @ts-expect-error orderBy KEYWORD
  "orderBy KEYWORD": [() => index.query({ orderBy: { category: "ASC" } }), "for order by"],
  // @ts-expect-error orderBy non-fast date
  "orderBy non-fast date": [() => index.query({ orderBy: { updatedAt: "ASC" } }), "is not a fast field"],
  // @ts-expect-error orderBy two fields
  "orderBy two fields": [() => index.query({ orderBy: { price: "ASC", stock: "DESC" } }), "syntax error"],
  // @ts-expect-error scoreFunc TEXT
  "scoreFunc TEXT": [() => index.query({ filter: { name: "x" }, scoreFunc: "name" }), "not configured as fast field"],
  // @ts-expect-error scoreFunc fast date
  "scoreFunc date": [() => index.query({ filter: { name: "x" }, scoreFunc: "createdAt" }), "for score functions"],
  // @ts-expect-error highlight unknown field
  "highlight unknown field": [() => index.query({ filter: { name: "x" }, highlight: { fields: ["nope"] } }), "does not exist"],

  // aggregations
  // @ts-expect-error $avg on TEXT
  "agg $avg on TEXT": [() => index.aggregate({ aggregations: { p: { $avg: { field: "name" } } } }), "to be FAST"],
  // @ts-expect-error $avg on KEYWORD
  "agg $avg on KEYWORD": [() => index.aggregate({ aggregations: { p: { $avg: { field: "category" } } } }), "cannot be used with field"],
  // @ts-expect-error $terms on TEXT
  "agg $terms on TEXT": [() => index.aggregate({ aggregations: { p: { $terms: { field: "name" } } } }), "to be FAST"],
  // @ts-expect-error $avg on non-fast bool
  "agg $avg on non-fast bool": [() => index.aggregate({ aggregations: { p: { $avg: { field: "featured" } } } }), "FAST"],
  // @ts-expect-error $histogram on KEYWORD
  "agg $histogram on KEYWORD": [() => index.aggregate({ aggregations: { p: { $histogram: { field: "category", interval: 1 } } } }), "cannot be used with field"],
  // @ts-expect-error $facet on KEYWORD
  "agg $facet on KEYWORD": [() => index.aggregate({ aggregations: { p: { $facet: { field: "category", path: "/a" } } } }), "Allowed types: FACET"],
  // @ts-expect-error metric with sub-aggregations
  "agg metric with $aggs": [() => index.aggregate({ aggregations: { p: { $avg: { field: "price" }, $aggs: terms } } }), "cannot have sub-aggregations"],
  // @ts-expect-error unknown field
  "agg unknown field": [() => index.aggregate({ aggregations: { p: { $avg: { field: "nope" } } } }), "unknown field"],
  // @ts-expect-error $dateHistogram on number
  "agg $dateHistogram on number": [() => index.aggregate({ aggregations: { d: { $dateHistogram: { field: "price", fixedInterval: "1d" } } } }), "cannot be used with field"],
  // @ts-expect-error $range on KEYWORD
  "agg $range on KEYWORD": [() => index.aggregate({ aggregations: { r: { $range: { field: "category", ranges: [{ to: 1 }] } } } }), "cannot be used with field"],
  // @ts-expect-error $percentiles on BOOL
  "agg $percentiles on BOOL": [() => index.aggregate({ aggregations: { p: { $percentiles: { field: "active" } } } }), "cannot be used with field"],
  // @ts-expect-error $composite source on TEXT
  "agg $composite on TEXT": [() => index.aggregate({ aggregations: { c: { $composite: { sources: [{ n: { $terms: { field: "name" } } }] } } } }), "FAST"],
  // @ts-expect-error $facet as a sub-aggregation
  "agg $facet in $aggs": [() => index.aggregate({ aggregations: { c: { $terms: { field: "category" }, $aggs: { f: { $facet: { field: "tags", path: "/" } } } } } }), "as a sub-aggregation"],
  // @ts-expect-error $facet with sub-aggregations
  "agg $facet with $aggs": [() => index.aggregate({ aggregations: { f: { $facet: { field: "tags", path: "/" }, $aggs: terms } } }), "cannot have sub-aggregations"],
  "agg $composite both intervals": [() => index.aggregate({ aggregations: { c: { $composite: { sources: [{ m: { $dateHistogram: { field: "createdAt", fixedInterval: "1d", calendarInterval: "month" } } }] } } } }), "one and only one"],
};

// Accepted by the server but rejected by the types, because the call cannot do what it says.
// prettier-ignore
const typeOnly: Record<string, () => Promise<unknown>> = {
  // @ts-expect-error documented as unsupported for KEYWORD
  "$fuzzy on KEYWORD": () => index.query({ filter: { category: { $fuzzy: "audi" } } }),
  // @ts-expect-error documented as unsupported for KEYWORD
  "$phrase on KEYWORD": () => index.query({ filter: { category: { $phrase: "audio" } } }),
  // @ts-expect-error documented as unsupported for KEYWORD
  "$regex on KEYWORD": () => index.query({ filter: { category: { $regex: "aud.*" } } }),
  // @ts-expect-error the field is never returned
  "select unknown field": () => index.query({ select: { nope: true } }),
  // @ts-expect-error next to a field, $or stops filtering
  "$or next to a field": () => index.query({ filter: { $must: [{ category: "audio", $or: [{ name: "earplugs" }] }] } }),
  // @ts-expect-error next to $must, $or stops filtering
  "$or next to $must": () => index.query({ filter: { $must: { category: "audio" }, $or: [{ name: "earplugs" }] } }),
  // @ts-expect-error a $boost object is a $must clause, so $or stops filtering
  "$or next to a $boost object": () => index.query({ filter: { $boost: { query: { name: "headphones" }, value: 3 }, $or: [{ name: "earbuds" }] } }),
};

describe("search conformance: valid", () => {
  for (const [label, run] of Object.entries(valid)) {
    test(label, async () => {
      await run();
    });
  }
});

describe("search conformance: rejected by types only", () => {
  for (const [label, run] of Object.entries(typeOnly)) {
    test(label, async () => {
      await run();
    });
  }
});

describe("search conformance: invalid", () => {
  for (const [label, [run, message]] of Object.entries(invalid)) {
    test(label, async () => {
      await expect(run()).rejects.toThrow(message);
    });
  }
});
