import { Redis } from "../platforms/nodejs"
import { keygen, newHttpClient } from "./test-utils";

import { afterEach, describe, expect, test } from "bun:test";
import { ScriptLoadCommand } from "./commands/script_load";

const redis = Redis.fromEnv({
  enableAutoPipelining: true,
  latencyLogging: false
})
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

describe("Auto pipeline", () => {
  test("should execute all commands inside a Promise.all in a single pipeline", async () => {
    const persistentKey = newKey();
    const persistentKey2 = newKey();
    const scriptHash = await new ScriptLoadCommand(["return 1"]).exec(client);

    // all the following commands are in a single pipeline call
    const result = await Promise.all([
      redis.append(newKey(), "hello"),
      redis.bitcount(newKey(), 0, 1),
      redis.bitop("and", newKey(), newKey()),
      redis.bitpos(newKey(), 1, 0),
      redis.dbsize(),
      redis.decr(newKey()),
      redis.decrby(newKey(), 1),
      redis.del(newKey()),
      redis.echo("hello"),
      redis.eval("return ARGV[1]", [], ["Hello"]),
      redis.evalsha(scriptHash, [], ["Hello"]),
      redis.exists(newKey()),
      redis.expire(newKey(), 5),
      redis.expireat(newKey(), Math.floor(new Date().getTime() / 1000) + 60),
      redis.flushall(),
      redis.flushdb(),
      redis.get(newKey()),
      redis.getbit(newKey(), 0),
      redis.getdel(newKey()),
      redis.getset(newKey(), "hello"),
      redis.hdel(newKey(), "field"),
      redis.hexists(newKey(), "field"),
      redis.hget(newKey(), "field"),
      redis.hgetall(newKey()),
      redis.hincrby(newKey(), "field", 1),
      redis.hincrbyfloat(newKey(), "field", 1.5),
      redis.hkeys(newKey()),
      redis.hlen(newKey()),
      redis.hmget(newKey(), newKey()),
      redis.hmset(newKey(), { field: "field", value: "value" }),
      redis.hscan(newKey(), 0),
      redis.hset(newKey(), { field: "value" }),
      redis.hsetnx(newKey(), "field", "value"),
      redis.hstrlen(newKey(), "field"),
      redis.hvals(newKey()),
      redis.incr(newKey()),
      redis.incrby(newKey(), 1),
      redis.incrbyfloat(newKey(), 1.5),
      redis.keys("*"),
      redis.lindex(newKey(), 0),
      redis.linsert(newKey(), "before", "pivot", "value"),
      redis.llen(newKey()),
      redis.lmove(newKey(), newKey(), "left", "right"),
      redis.lpop(newKey()),
      redis.lpos(newKey(), "value"),
      redis.lpush(persistentKey, "element"),
      redis.lpushx(newKey(), "element1", "element2"),
      redis.lrange(newKey(), 0, 1),
      redis.lrem(newKey(), 1, "value"),
      redis.lset(persistentKey, 0, "value"),
      redis.ltrim(newKey(), 0, 1),
      redis.hrandfield(newKey()),
      redis.hrandfield(newKey(), 2),
      redis.hrandfield(newKey(), 3, true),
      redis.mget<[string, string]>(newKey(), newKey()),
      redis.mset({ key1: "value", key2: "value" }),
      redis.msetnx({ key3: "value", key4: "value" }),
      redis.persist(newKey()),
      redis.pexpire(newKey(), 1000),
      redis.pexpireat(newKey(), new Date().getTime() + 1000),
      redis.ping(),
      redis.psetex(newKey(), 1, "value"),
      redis.pttl(newKey()),
      redis.publish("test", "hello"),
      redis.randomkey(),
      redis.rename(persistentKey, persistentKey2),
      redis.renamenx(persistentKey2, newKey()),
      redis.rpop(newKey()),
      redis.rpush(newKey(), "element1", "element2"),
      redis.rpushx(newKey(), "element1", "element2"),
      redis.sadd(newKey(), "memeber1", "member2"),
      redis.scan(0),
      redis.scard(newKey()),
      redis.sdiff(newKey()),
      redis.sdiffstore(newKey(), newKey()),
      redis.set(newKey(), "value"),
      redis.setbit(newKey(), 1, 1),
      redis.setex(newKey(), 1, "value"),
      redis.setnx(newKey(), "value"),
      redis.setrange(newKey(), 1, "value"),
      redis.sinter(newKey(), newKey()),
      redis.sinterstore(newKey(), newKey()),
      redis.sismember(newKey(), "member"),
      redis.smembers(newKey()),
      redis.smove(newKey(), newKey(), "member"),
      redis.spop(newKey()),
      redis.srandmember(newKey()),
      redis.srem(newKey(), "member"),
      redis.sscan(newKey(), 0),
      redis.strlen(newKey()),
      redis.sunion(newKey()),
      redis.sunionstore(newKey(), newKey()),
      redis.time(),
      redis.touch(newKey()),
      redis.ttl(newKey()),
      redis.type(newKey()),
      redis.unlink(newKey()),
      redis.zadd(newKey(), { score: 0, member: "member" }),
      redis.zcard(newKey()),
      redis.scriptExists(scriptHash),
      redis.scriptFlush({ async: true }),
      redis.scriptLoad("return 1"),
      redis.zcount(newKey(), 0, 1),
      redis.zincrby(newKey(), 1, "member"),
      redis.zinterstore(newKey(), 1, [newKey()]),
      redis.zlexcount(newKey(), "-", "+"),
      redis.zpopmax(newKey()),
      redis.zpopmin(newKey()),
      redis.zrange(newKey(), 0, 1),
      redis.zrank(newKey(), "member"),
      redis.zrem(newKey(), "member"),
      redis.zremrangebylex(newKey(), "-", "+"),
      redis.zremrangebyrank(newKey(), 0, 1),
      redis.zremrangebyscore(newKey(), 0, 1),
      redis.zrevrank(newKey(), "member"),
      redis.zscan(newKey(), 0),
      redis.zscore(newKey(), "member"),
      redis.zunionstore(newKey(), 1, [newKey()]),
      redis.zunion(1, [newKey()]),
      redis.json.set(newKey(), "$", { hello: "world" })
    ])
    expect(result).toBeTruthy()
    expect(result.length).toBe(120) // returns 120 results
  });

  test("should be able to group async requests with sync requests", async () => {

    // following five commands are added to the pipeline
    redis.flushdb()
    redis.incr("baz")
    redis.incr("baz")
    redis.set("foo", "bar")
    redis.incr("baz")

    // two get calls are added to the pipeline and pipeline
    // is executed since we called await
    const [fooValue, bazValue] = await Promise.all([
      redis.get("foo"),
      redis.get("baz")
    ])

    expect(fooValue).toBe("bar")
    expect(bazValue).toBe(3)
  })
});
