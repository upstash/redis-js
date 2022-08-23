import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { Redis } from "https://deno.land/x/upstash_redis@v1.12.0-rc.1/mod.ts";

Deno.test("Simple counter", async () => {
  const redis = Redis.fromEnv();
  const counter = await redis.incr("deno counter");
  assertEquals(typeof counter, "number");
  assert(counter > 0);
});
