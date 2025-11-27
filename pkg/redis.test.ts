import { Redis } from "./redis";
import { keygen, newHttpClient, randomID } from "./test-utils";

import { afterEach, describe, expect, test } from "bun:test";
import { HttpClient } from "./http";
import type { ScanResultStandard, ScanResultWithType } from "./commands/scan";
import { s } from "./commands/search";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

describe("when storing base64 data", () => {
  test(
    "general",
    async () => {
      const redis = new Redis(client);
      const key = newKey();
      const value = "VXBzdGFzaCBpcyByZWFsbHkgY29vbA";
      await redis.set(key, value);
      const res = await redis.get(key);
      expect(res).toEqual(value);
    },
    { timeout: 150_000 }
  );

  // decode("OK") => 8
  test("getting '8'", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = 8;
    await redis.set(key, value);
    const res = await redis.get(key);
    expect(res).toEqual(value);
  });
  test("getting 'OK'", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = "OK";
    await redis.set(key, value);
    const res = await redis.get(key);
    expect(res).toEqual(value);
  });
});

describe("mget", () => {
  const key = newKey();
  const key1 = newKey();
  const value = "foobar";
  const value1 = "foobar1";
  const redis = new Redis(client);
  const queries = [key, key1];

  test("mget with array", async () => {
    await redis.mset({ key: value, key1: value1 });
    const res = await redis.mget(queries);

    expect(res.length).toEqual(2);
  });

  test("mget with spreaded array", async () => {
    await redis.mset({ key: value, key1: value1 });
    const res = await redis.mget(...queries);

    expect(res.length).toEqual(2);
  });
});

describe("when destructuring the redis class", () => {
  test("correctly binds this", async () => {
    const { get, set } = new Redis(client);
    const key = newKey();
    const value = randomID();
    await set(key, value);
    const res = await get(key);
    expect(res).toEqual(value);
  });
});

describe("zadd", () => {
  test("adds the set", async () => {
    const key = newKey();
    const score = 1;
    const member = randomID();

    const res = await new Redis(client).zadd(key, { score, member });
    expect(res).toEqual(1);
  });
});

describe("zrange", () => {
  test("returns the range", async () => {
    const key = newKey();
    const score = 1;
    const member = randomID();
    const redis = new Redis(client);
    await redis.zadd(key, { score, member });
    const res = await redis.zrange(key, 0, 2);
    expect(res).toEqual([member]);
  });
});

describe("middleware", () => {
  let state = false;
  test("before", async () => {
    const r = new Redis(client);
    r.use(async (req, next) => {
      state = true;

      return await next(req);
    });

    await r.incr(newKey());

    expect(state).toEqual(true);
  });

  test("after", async () => {
    let state = false;
    const r = new Redis(client);
    r.use(async (req, next) => {
      const res = await next(req);
      state = true;
      return res;
    });

    await r.incr(newKey());

    expect(state).toEqual(true);
  });
});

describe("special data", () => {
  test("with %", async () => {
    const key = newKey();
    const value = "%%12";
    const redis = new Redis(client);
    await redis.set(key, value);
    const res = await redis.get<string>(key);

    expect(res).toEqual(value);
  });
  test("empty string", async () => {
    const key = newKey();
    const value = "";
    const redis = new Redis(client);
    await redis.set(key, value);
    const res = await redis.get<string>(key);

    expect(res).toEqual(value);
  });

  test("not found key", async () => {
    const redis = new Redis(client);
    const res = await redis.get<string>(newKey());

    expect(res).toEqual(null);
  });

  test("with encodeURIComponent", async () => {
    const key = newKey();
    const value = "😀";
    const redis = new Redis(client);
    await redis.set(key, encodeURIComponent(value));
    const res = await redis.get<string>(key);
    if (res) expect(decodeURIComponent(res)).toEqual(value);
  });

  test("without encodeURIComponent", async () => {
    const key = newKey();
    const value = "😀";
    const redis = new Redis(client);
    await redis.set(key, value);
    const res = await redis.get<string>(key);

    expect(res).toEqual(value);
  });
  test("emojis", async () => {
    const key = newKey();
    const value = "😀";
    const redis = new Redis(client);
    await redis.set(key, value);
    const res = await redis.get(key);

    expect(res).toEqual(value);
  });
});

describe("disable base64 encoding", () => {
  test("emojis", async () => {
    const key = newKey();
    const value = "😀";
    const url = process.env.UPSTASH_REDIS_REST_URL;
    if (!url) {
      throw new Error("Could not find url");
    }
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!token) {
      throw new Error("Could not find token");
    }

    const client = new HttpClient({
      baseUrl: url,
      headers: { authorization: `Bearer ${token}` },
      responseEncoding: false,
    });
    const redis = new Redis(client);
    await redis.set(key, value);
    const res = await redis.get(key);

    expect(res).toEqual(value);
  });

  test("random bytes", async () => {
    const key = newKey();
    const value = crypto.getRandomValues(new Uint8Array(2 ** 8)).toString();
    const url = process.env.UPSTASH_REDIS_REST_URL;
    if (!url) {
      throw new Error("Could not find url");
    }
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!token) {
      throw new Error("Could not find token");
    }

    const client = new HttpClient({
      baseUrl: url,
      headers: { authorization: `Bearer ${token}` },
      responseEncoding: false,
    });
    const redis = new Redis(client);
    redis.use(async (r, next) => {
      const res = await next(r);
      return res;
    });
    await redis.set(key, value);
    const res = await redis.get(key);

    expect(res).toEqual(value);
  });
});

describe("tests with latency logging", () => {
  test("test should return OK with latency logs", async () => {
    const redis = new Redis(client, { latencyLogging: true });
    const key = newKey();
    const value = "OK";
    await redis.set(key, value);
    const res = await redis.get(key);
    expect(res).toEqual(value);
  });
});

const assertIsType = <T>(_arg: () => T) => {};

describe("return type of scan withType", () => {
  test("should return cursor and keys with types", async () => {
    const redis = new Redis(client);

    assertIsType<Promise<ScanResultStandard>>(() => redis.scan("0"));

    assertIsType<Promise<ScanResultStandard>>(() => redis.scan("0", {}));

    assertIsType<Promise<ScanResultStandard>>(() => redis.scan("0", { withType: false }));

    assertIsType<Promise<ScanResultWithType>>(() => redis.scan("0", { withType: true }));
  });
});

describe("search", () => {
  test("should query a search index", async () => {
    const redis = new Redis(client);
    const schema = s.object({
      id: s.text(),
      content: s.object({
        title: s.text().noStem(),
        content: s.text(),
        authors: s.text(),
      }),
      metadata: s.object({
        dateInt: s.unsignedInteger().fast(),
        url: s.text(),
        updated: s.date(),
        kind: s.text(),
      }),
    });
    const idx = redis.search({
      indexName: "vercel-changelog",
      schema,
      dataType: "string",
      prefix: "vercel-changelog:",
    });
    const result = await idx.query({ "content.title": { equals: "react" } }, { limit: 2 });
    expect(result).toBeDefined();
  });
});
