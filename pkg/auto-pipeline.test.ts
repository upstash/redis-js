import { Pipeline } from "./pipeline";
import { keygen, newHttpClient } from "./test-utils";

import { afterEach, describe, expect, test } from "bun:test";
import { PipelineAutoExecutor } from "./auto-pipeline";
import { ScriptLoadCommand } from "./commands/script_load";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

describe("Auto pipeline", () => {
  test("should exec commands without explicit directive", async () => {
    const pipeline = new PipelineAutoExecutor(
      new Pipeline({ client, commandOptions: { latencyLogging: true }, multiExec: false }),
    );

    const persistentKey = newKey();
    const persistentKey2 = newKey();

    const scriptHash = await new ScriptLoadCommand(["return 1"]).exec(client);

    const data = await pipeline.withAutoPipeline((p) =>
      p
        .append(newKey(), "hello")
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
        .unlink(newKey())
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
        .zunion(1, [newKey()])
        .json.set(newKey(), "$", { hello: "world" }),
    );
    expect(data).toBeTruthy();
  });

  test("should execute multiple calls successfully", async () => {
    const pipeline = new PipelineAutoExecutor(
      new Pipeline({ client, commandOptions: { latencyLogging: true }, multiExec: false }),
    );

    await pipeline.withAutoPipeline((pipeline) => {
      for (let i = 0; i < 1000; i++) {
        pipeline.set(`key${i}`, `value${i}`);
      }
    });
  });
});
