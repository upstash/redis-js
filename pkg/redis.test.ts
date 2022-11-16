import { Redis } from "./redis.ts";
import { keygen, newHttpClient, randomID } from "./test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { afterEach } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { HttpClient } from "./http.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

Deno.test("when storing base64 data", async (t) => {
  await t.step("general", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = "VXBzdGFzaCBpcyByZWFsbHkgY29vbA";
    await redis.set(key, value);
    const res = await redis.get(key);
    assertEquals(res, value);
  });

  // decode("OK") => 8
  await t.step("getting '8'", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = 8;
    await redis.set(key, value);
    const res = await redis.get(key);
    assertEquals(res, value);
  });
  await t.step("getting 'OK'", async () => {
    const redis = new Redis(client);
    const key = newKey();
    const value = "OK";
    await redis.set(key, value);
    const res = await redis.get(key);
    assertEquals(res, value);
  });
});

Deno.test("when destructuring the redis class", async (t) => {
  await t.step("correctly binds this", async () => {
    const { get, set } = new Redis(client);
    const key = newKey();
    const value = randomID();
    await set(key, value);
    const res = await get(key);
    assertEquals(res, value);
  });
});

Deno.test("zadd", async (t) => {
  await t.step("adds the set", async () => {
    const key = newKey();
    const score = 1;
    const member = randomID();

    const res = await new Redis(client).zadd(key, { score, member });
    assertEquals(res, 1);
  });
});

Deno.test("zrange", async (t) => {
  await t.step("returns the range", async () => {
    const key = newKey();
    const score = 1;
    const member = randomID();
    const redis = new Redis(client);
    await redis.zadd(key, { score, member });
    const res = await redis.zrange(key, 0, 2);
    assertEquals(res, [member]);
  });
});

Deno.test("middleware", async (t) => {
  let state = false;
  await t.step("before", async () => {
    const r = new Redis(client);
    r.use(async (req, next) => {
      state = true;

      return await next(req);
    });

    await r.incr(newKey());

    assertEquals(state, true);
  });

  await t.step("after", async () => {
    let state = false;
    const r = new Redis(client);
    r.use(async (req, next) => {
      const res = await next(req);
      state = true;
      return res;
    });

    await r.incr(newKey());

    assertEquals(state, true);
  });
});

Deno.test("special data", async (t) => {
  await t.step("with %", async () => {
    const key = newKey();
    const value = "%%12";
    const redis = new Redis(client);
    await redis.set(key, value);
    const res = await redis.get<string>(key);

    assertEquals(res!, value);
  });
  await t.step("empty string", async () => {
    const key = newKey();
    const value = "";
    const redis = new Redis(client);
    await redis.set(key, value);
    const res = await redis.get<string>(key);

    assertEquals(res!, value);
  });

  await t.step("not found key", async () => {
    const redis = new Redis(client);
    const res = await redis.get<string>(newKey());

    assertEquals(res!, null);
  });

  await t.step("with encodeURIComponent", async () => {
    const key = newKey();
    const value = "😀";
    const redis = new Redis(client);
    await redis.set(key, encodeURIComponent(value));
    const res = await redis.get<string>(key);

    assertEquals(res!, decodeURIComponent(value));
  });
  await t.step("emojis", async () => {
    const key = newKey();
    const value = "😀";
    const redis = new Redis(client);
    await redis.set(key, value);
    const res = await redis.get(key);

    assertEquals(res, value);
  });
});

Deno.test("disable base64 encoding", async (t) => {
  await t.step("emojis", async () => {
    const key = newKey();
    const value = "😀";
    const url = Deno.env.get("UPSTASH_REDIS_REST_URL");
    if (!url) {
      throw new Error("Could not find url");
    }
    const token = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
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

    assertEquals(res, value);
  });

  await t.step("random bytes", async () => {
    const key = newKey();
    const value = crypto.getRandomValues(new Uint8Array(2 ** 8)).toString();
    const url = Deno.env.get("UPSTASH_REDIS_REST_URL");
    if (!url) {
      throw new Error("Could not find url");
    }
    const token = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
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

    assertEquals(res, value);
  });
});
