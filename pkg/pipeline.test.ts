import { Pipeline } from "./pipeline.ts";
import { Redis } from "./redis.ts";
import { keygen, newHttpClient, randomID } from "./test-utils.ts";
import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { afterEach } from "https://deno.land/std@0.177.0/testing/bdd.ts";

import { ScriptLoadCommand } from "./commands/script_load.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

Deno.test("with destructuring", async (t) => {
  await t.step("correctly binds this", async () => {
    const { pipeline } = new Redis(client);
    const p = pipeline();

    const { echo, exec } = p;
    echo("Hello");

    const res = await exec();
    assertEquals(res, ["Hello"]);
  });
});

Deno.test("with single command", async (t) => {
  await t.step("works with multiple commands", async () => {
    const p = new Pipeline({ client });
    p.set(newKey(), randomID());
    const res = await p.exec();
    assertEquals(res.length, 1);
    assertEquals(res[0], "OK");
  });
});

Deno.test("when chaining in a for loop", async (t) => {
  await t.step("works", async () => {
    const key = newKey();
    const res = await new Pipeline({ client }).set(key, randomID()).get(key)
      .exec();

    assertEquals(res.length, 2);
  });
});

Deno.test("when chaining inline", async (t) => {
  await t.step("works", async () => {
    const key = newKey();
    const p = new Pipeline({ client });
    for (let i = 0; i < 10; i++) {
      p.set(key, randomID());
    }

    const res = await p.exec();
    assertEquals(res.length, 10);
  });
});

Deno.test("when no commands were added", async (t) => {
  await t.step("throws", async () => {
    await assertRejects(() => new Pipeline({ client }).exec());
  });
});

Deno.test("when one command throws an error", async (t) => {
  await t.step("throws", async () => {
    const p = new Pipeline({ client }).set("key", "value").hget("key", "field");
    await assertRejects(() => p.exec());
  });
});

Deno.test("transaction", async (t) => {
  await t.step("works", async () => {
    const key = newKey();
    const value = randomID();
    const tx = new Pipeline({ client, multiExec: true });
    tx.set(key, value);
    tx.get(key);
    tx.del(key);

    const [ok, storedvalue, deleted] = await tx.exec<["OK", string, number]>();
    assertEquals(ok, "OK");
    assertEquals(storedvalue, value);
    assertEquals(deleted, 1);
  });
});
Deno.test("use all the things", async (t) => {
  await t.step("works", async () => {
    const p = new Pipeline({ client });

    const persistentKey = newKey();
    const persistentKey2 = newKey();

    const scriptHash = await new ScriptLoadCommand(["return 1"]).exec(client);

    p.append(newKey(), "hello")
      .bitcount(newKey(), 0, 1)
      .bitop("and", newKey(), newKey())
      .bitpos(newKey(), 1, 0)
      .dbsize()
      .decr(newKey())
      .decrby(newKey(), 1)
      .del(newKey())
      .echo("hello")
      .eval("return ARGV[1]", [], ["Hello"])
      .evalsha(scriptHash, [], ["Hello"])
      .exists(newKey())
      .expire(newKey(), 5)
      .expireat(newKey(), Math.floor(new Date().getTime() / 1000) + 60)
      .flushall()
      .flushdb()
      .get(newKey())
      .getbit(newKey(), 0)
      .getdel(newKey())
      .getrange(newKey(), 0, 1)
      .getset(newKey(), "hello")
      .hdel(newKey(), "field")
      .hexists(newKey(), "field")
      .hget(newKey(), "field")
      .hgetall(newKey())
      .hincrby(newKey(), "field", 1)
      .hincrbyfloat(newKey(), "field", 1.5)
      .hkeys(newKey())
      .hlen(newKey())
      .hmget(newKey(), newKey())
      .hmset(newKey(), { field: "field", value: "value" })
      .hscan(newKey(), 0)
      .hset(newKey(), { field: "value" })
      .hsetnx(newKey(), "field", "value")
      .hstrlen(newKey(), "field")
      .hvals(newKey())
      .incr(newKey())
      .incrby(newKey(), 1)
      .incrbyfloat(newKey(), 1.5)
      .keys("*")
      .lindex(newKey(), 0)
      .linsert(newKey(), "before", "pivot", "value")
      .llen(newKey())
      .lmove(newKey(), newKey(), "left", "right")
      .lpop(newKey())
      .lpos(newKey(), "value")
      .lpush(persistentKey, "element")
      .lpushx(newKey(), "element1", "element2")
      .lrange(newKey(), 0, 1)
      .lrem(newKey(), 1, "value")
      .lset(persistentKey, 0, "value")
      .ltrim(newKey(), 0, 1)
      .hrandfield(newKey())
      .hrandfield(newKey(), 2)
      .hrandfield(newKey(), 3, true)
      .mget<[string, string]>(newKey(), newKey())
      .mset({ key1: "value", key2: "value" })
      .msetnx({ key3: "value", key4: "value" })
      .persist(newKey())
      .pexpire(newKey(), 1000)
      .pexpireat(newKey(), new Date().getTime() + 1000)
      .ping()
      .psetex(newKey(), 1, "value")
      .pttl(newKey())
      .publish("test", "hello")
      .randomkey()
      .rename(persistentKey, persistentKey2)
      .renamenx(persistentKey2, newKey())
      .rpop(newKey())
      .rpush(newKey(), "element1", "element2")
      .rpushx(newKey(), "element1", "element2")
      .sadd(newKey(), "memeber1", "member2")
      .scan(0)
      .scard(newKey())
      .sdiff(newKey())
      .sdiffstore(newKey(), newKey())
      .set(newKey(), "value")
      .setbit(newKey(), 1, 1)
      .setex(newKey(), 1, "value")
      .setnx(newKey(), "value")
      .setrange(newKey(), 1, "value")
      .sinter(newKey(), newKey())
      .sinterstore(newKey(), newKey())
      .sismember(newKey(), "member")
      .smembers(newKey())
      .smove(newKey(), newKey(), "member")
      .spop(newKey())
      .srandmember(newKey())
      .srem(newKey(), "member")
      .sscan(newKey(), 0)
      .strlen(newKey())
      .sunion(newKey())
      .sunionstore(newKey(), newKey())
      .time()
      .touch(newKey())
      .ttl(newKey())
      .type(newKey())
      .unlink()
      .zadd(newKey(), { score: 0, member: "member" })
      .zcard(newKey())
      .scriptExists(scriptHash)
      .scriptFlush({ async: true })
      .scriptLoad("return 1")
      .zcount(newKey(), 0, 1)
      .zincrby(newKey(), 1, "member")
      .zinterstore(newKey(), 1, [newKey()])
      .zlexcount(newKey(), "-", "+")
      .zpopmax(newKey())
      .zpopmin(newKey())
      .zrange(newKey(), 0, 1)
      .zrank(newKey(), "member")
      .zrem(newKey(), "member")
      .zremrangebylex(newKey(), "-", "+")
      .zremrangebyrank(newKey(), 0, 1)
      .zremrangebyscore(newKey(), 0, 1)
      .zrevrank(newKey(), "member")
      .zscan(newKey(), 0)
      .zscore(newKey(), "member")
      .zunionstore(newKey(), 1, [newKey()])
      .json.set(newKey(), "$", { hello: "world" });

    const res = await p.exec();
    assertEquals(res.length, 120);
  });
});
