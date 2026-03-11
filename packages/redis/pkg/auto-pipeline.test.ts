import { Redis } from "../platforms/nodejs";
import { keygen, newHttpClient } from "./test-utils";

import { afterEach, describe, expect, test } from "bun:test";
import { ScriptLoadCommand } from "./commands/script_load";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

describe("Auto pipeline", () => {
  test("should execute all commands inside a Promise.all in a single pipeline", async () => {
    const persistentKey = newKey();
    const persistentKey2 = newKey();
    const persistentKey3 = newKey();
    const scriptHash = await new ScriptLoadCommand(["return 1"]).exec(client);

    const redis = Redis.fromEnv({
      latencyLogging: false,
      enableAutoPipelining: true,
    });
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

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
      redis.evalRo("return ARGV[1]", [], ["Hello"]),
      redis.eval("return ARGV[1]", [], ["Hello"]),
      redis.evalshaRo(scriptHash, [], ["Hello"]),
      redis.evalsha(scriptHash, [], ["Hello"]),
      redis.exists(newKey()),
      redis.expire(newKey(), 5),
      redis.expireat(newKey(), Math.floor(Date.now() / 1000) + 60),
      redis.flushall(),
      redis.flushdb(),
      redis.get(newKey()),
      redis.getbit(newKey(), 0),
      redis.getdel(newKey()),
      redis.getex(newKey()),
      redis.getset(newKey(), "hello"),
      redis.hdel(newKey(), "field"),
      redis.hexists(newKey(), "field"),
      redis.hexpire(newKey(), "field", 1),
      redis.hexpireat(newKey(), "field", Math.floor(Date.now() / 1000) + 60),
      redis.hexpiretime(newKey(), "field"),
      redis.httl(newKey(), "field"),
      redis.hpexpire(newKey(), "field", 1),
      redis.hpexpireat(newKey(), "field", Math.floor(Date.now() / 1000) + 60),
      redis.hpexpiretime(newKey(), "field"),
      redis.hpttl(newKey(), "field"),
      redis.hpersist(newKey(), "field"),
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
      redis.pexpireat(newKey(), Date.now() + 1000),
      redis.ping(),
      redis.psetex(newKey(), 1, "value"),
      redis.pttl(newKey()),
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
      redis.json.set(persistentKey3, "$", { log: ["one", "two"] }),
      redis.json.arrappend(persistentKey3, "$.log", '"three"'),
      redis.json.merge(persistentKey3, "$.log", '"three"'),
    ]);
    expect(result).toBeTruthy();
    expect(result.length).toBe(133); // returns

    // @ts-expect-error pipelineCounter is not in type but accessible results
    expect(redis.pipelineCounter).toBe(1);
  });

  test("should group async requests with sync requests", async () => {
    const redis = Redis.fromEnv({
      latencyLogging: false,
      enableAutoPipelining: true,
    });
    await redis.flushdb();
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    // following five commands are added to the pipeline
    void redis.del("baz");
    void redis.incr("baz");
    void redis.incr("baz");
    void redis.set("foo", "bar");
    void redis.incr("baz");

    // two get calls are added to the pipeline and pipeline
    // is executed since we called await
    const [fooValue, bazValue] = await Promise.all([redis.get("foo"), redis.get("baz")]);

    expect(fooValue).toBe("bar");
    expect(bazValue).toBe(3);
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(1);
  });

  test("should execute a pipeline for each consecutive awaited command", async () => {
    const redis = Redis.fromEnv({
      latencyLogging: false,
      enableAutoPipelining: true,
    });

    const key1 = newKey();
    const key2 = newKey();

    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    await redis.flushdb();

    const res1 = await redis.incr(key1);
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(1);

    const res2 = await redis.incr(key1);
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(2);

    const res3 = await redis.set(key2, "bar");
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(3);

    expect([res1, res2, res3]).toEqual([1, 2, "OK"]);
  });

  test("should execute a single pipeline for several commands inside Promise.all", async () => {
    const redis = Redis.fromEnv({
      latencyLogging: false,
      enableAutoPipelining: true,
    });
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    const key1 = newKey();
    const key2 = newKey();

    const resArray = await Promise.all([
      redis.dbsize(),
      redis.incr(key1),
      redis.incr(key1),
      redis.set(key2, "bar"),
      redis.get(key2),
    ]);
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(1);
    expect(resArray).toEqual([expect.any(Number), 1, 2, "OK", "bar"]);
  });

  test("should be able to utilize only redis functions 'use' like usual", async () => {
    const redis = Redis.fromEnv({
      latencyLogging: false,
      enableAutoPipelining: true,
    });
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    let state = false;
    redis.use(async (req, next) => {
      state = true;
      return await next(req);
    });

    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    const a = await redis.incr("aeroplane");
    expect(a).toEqual(1);
    expect(state).toEqual(true);

    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(1);
  });

  test("should be able to utilize only redis functions 'multi' and 'pipeline' like usual", async () => {
    const redis = Redis.fromEnv({
      latencyLogging: false,
      enableAutoPipelining: true,
    });
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    const pipe = redis.pipeline();
    pipe.incr("voila");
    pipe.incr("voila");
    const result = await pipe.exec();
    expect(result).toEqual([1, 2]);

    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    const transaction = redis.multi();
    transaction.incr("et voila");
    transaction.incr("et voila");
    const result_2 = await transaction.exec();
    expect(result_2).toEqual([1, 2]);

    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);
  });

  test("should be able to utilize only redis functions 'createScript' like usual", async () => {
    const redis = Redis.fromEnv({
      latencyLogging: false,
      enableAutoPipelining: true,
    });
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    const script = redis.createScript("return ARGV[1];");

    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    const res = await script.eval([], ["Hello World"]);
    expect(res).toEqual("Hello World");

    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(1);
  });

  test("should handle JSON commands correctly", async () => {
    const redis = Redis.fromEnv({
      latencyLogging: false,
      enableAutoPipelining: true,
    });

    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    const res = await Promise.all([
      redis.set("foo1", "bar"),
      redis.json.set("baz1", "$", { hello: "world" }),
      redis.get("foo1"),
      redis.json.get("baz1"),
      redis.json.del("baz1"),
      redis.json.get("baz1"),
    ]);

    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(1);

    expect(res).toEqual(["OK", "OK", "bar", { hello: "world" }, 1, null]);
  });

  test("should throw errors granularly", async () => {
    // in this test, we have two methods being called parallel. both
    // use redis, but one of them has try/catch. when the request in
    // try fails, it shouldn't make the request in the parallel request
    // fail
    const redis = Redis.fromEnv({
      enableAutoPipelining: true,
    });

    const scriptLoadCommand = new ScriptLoadCommand(["redis.call('SET', 'foobar', 'foobar')"]);
    const scriptHash = await scriptLoadCommand.exec(client);
    await redis.scriptFlush();

    const methodOne = async () => {
      // method with try catch
      try {
        await redis.evalsha(scriptHash, [], []);
        throw new Error("test should have thrown in the command above");
      } catch (error_) {
        const error = error_ as Error;

        if (error.message.includes("NOSCRIPT")) {
          await scriptLoadCommand.exec(client);
          await redis.evalsha(scriptHash, [], []);
          return true;
        } else {
          throw new Error("incorrect error was thrown:", error);
        }
      }
    };

    const methodTwo = async () => {
      await redis.set("barfoo", "barfoo");
      return await redis.get("barfoo");
    };

    const [result1, result2] = await Promise.all([methodOne(), methodTwo()]);
    expect(result1).toBeTrue();
    expect(result2).toBe("barfoo");

    // first method executed correctly
    const result = await redis.get("foobar");
    expect(result).toBe("foobar");
  });

  describe("excluded commands", () => {
    test("should not exclude set", async () => {
      const redis = Redis.fromEnv();
      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(0);

      await redis.set("foo", "bar");

      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(1);
    });

    test("should exclude some commands", async () => {
      const redis = Redis.fromEnv({});

      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(0);

      await redis.scan(0, { count: 1 });
      await redis.keys("some-random-pattern");
      await redis.flushdb();
      await redis.flushall();
      await redis.dbsize();
      await redis.exec(["SET", "foo", "bar"]);

      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(0);
    });
  });
});
