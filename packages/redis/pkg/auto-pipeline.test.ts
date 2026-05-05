import { Redis } from "../platforms/nodejs";
import { keygen, newHttpClient } from "./test-utils";

import { afterEach, describe, expect, test } from "bun:test";
import { ScriptLoadCommand } from "./commands/script_load";
import { MAX_PIPELINE_SIZE } from "./auto-pipeline";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

// Structural shape of the (private) AutoPipelineExecutor and Pipeline internals
// used only for asserting that commands are routed to the correct pipeline.
type PipelineLike = {
  length: () => number;
  commands: { command: (string | number | boolean)[] }[];
};
type AutoPipelineExecutorLike = {
  activeReadPipeline: PipelineLike | null;
  activeWritePipeline: PipelineLike | null;
};
const getExecutor = (redis: Redis): AutoPipelineExecutorLike =>
  (redis as unknown as { autoPipelineExecutor: AutoPipelineExecutorLike }).autoPipelineExecutor;

describe("Auto pipeline", () => {
  test("should batch a large Promise.all of mixed reads and writes into one read and one write pipeline", async () => {
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
    expect(result.length).toBe(130); // returns

    // @ts-expect-error pipelineCounter is not in type but accessible results
    expect(redis.pipelineCounter).toBe(2);
  });

  test("should group fire-and-forget writes with the next awaited write into one write pipeline, then reads into a separate read pipeline", async () => {
    const redis = Redis.fromEnv({
      latencyLogging: false,
      enableAutoPipelining: true,
    });
    await redis.flushdb();
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    // following four void writes get grouped with the awaited write below
    // into a single write pipeline
    void redis.del("baz");
    void redis.incr("baz");
    void redis.incr("baz");
    void redis.incr("baz");

    const setResult = await redis.set("foo", "bar");
    expect(setResult).toBe("OK");

    // all five writes executed in one write pipeline
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(1);

    // reads below grouped into a single read pipeline
    const [fooValue, bazValue] = await Promise.all([redis.get("foo"), redis.get("baz")]);

    expect(fooValue).toBe("bar");
    expect(bazValue).toBe(3);
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(2);
  });

  test("should create a new pipeline for each consecutively awaited command", async () => {
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

  test("should batch writes inside Promise.all into a single write pipeline while skipping excluded commands like dbsize", async () => {
    const redis = Redis.fromEnv({
      latencyLogging: false,
      enableAutoPipelining: true,
    });
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    const key1 = newKey();
    const key2 = newKey();

    // dbsize is excluded from auto-pipelining (direct call); the rest are writes
    // and go into a single write pipeline.
    const writeResults = await Promise.all([
      redis.dbsize(),
      redis.incr(key1),
      redis.incr(key1),
      redis.set(key2, "bar"),
    ]);
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(1);
    expect(writeResults).toEqual([expect.any(Number), 1, 2, "OK"]);

    // a separate read pipeline executes the get
    const getResult = await redis.get(key2);
    expect(getResult).toBe("bar");
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(2);
  });

  test("should still apply redis.use middleware to auto-pipelined commands", async () => {
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

  test("should not increment the auto-pipeline counter when explicit pipeline() or multi() is used", async () => {
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

  test("should auto-pipeline createScript().eval() calls", async () => {
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

  test("should split JSON reads and writes into separate pipelines across awaited Promise.all calls", async () => {
    const redis = Redis.fromEnv({
      latencyLogging: false,
      enableAutoPipelining: true,
    });

    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(0);

    // First do the writes — one write pipeline
    const writeRes = await Promise.all([
      redis.set("foo1", "bar"),
      redis.json.set("baz1", "$", { hello: "world" }),
    ]);
    expect(writeRes).toEqual(["OK", "OK"]);
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(1);

    // Then do the reads — one read pipeline
    const readRes = await Promise.all([redis.get("foo1"), redis.json.get("baz1")]);
    expect(readRes).toEqual(["bar", { hello: "world" }]);
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(2);

    // delete then verify gone — another write + read pipeline
    const delRes = await redis.json.del("baz1");
    expect(delRes).toBe(1);
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(3);

    const afterDel = await redis.json.get("baz1");
    expect(afterDel).toBeNull();
    // @ts-expect-error pipelineCounter is not in type but accessible
    expect(redis.pipelineCounter).toBe(4);
  });

  test("should isolate errors between parallel callers so a caught failure doesn't affect another concurrent flow", async () => {
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

  describe("max pipeline size", () => {
    test("should split into two pipelines when MAX_PIPELINE_SIZE + 500 commands are queued", async () => {
      const redis = Redis.fromEnv({
        latencyLogging: false,
        enableAutoPipelining: true,
      });

      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(0);

      const totalCommands = MAX_PIPELINE_SIZE + 500;
      const promises = Array.from({ length: totalCommands }, (_, i) => redis.echo(`msg-${i}`));

      const results = await Promise.all(promises);

      for (let i = 0; i < totalCommands; i++) {
        expect(results[i]).toBe(`msg-${i}`);
      }

      // Should have used 2 pipelines: 1000 + 500
      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(2);
    });

    test("should use exactly one pipeline when the queued command count equals MAX_PIPELINE_SIZE", async () => {
      const redis = Redis.fromEnv({
        latencyLogging: false,
        enableAutoPipelining: true,
      });

      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(0);

      const promises = Array.from({ length: MAX_PIPELINE_SIZE }, (_, i) => redis.echo(`msg-${i}`));
      const results = await Promise.all(promises);

      for (let i = 0; i < MAX_PIPELINE_SIZE; i++) {
        expect(results[i]).toBe(`msg-${i}`);
      }

      // Exactly at the limit — should be 1 pipeline
      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(1);
    });

    test("should split 2*MAX_PIPELINE_SIZE + 500 commands into three pipelines", async () => {
      const redis = Redis.fromEnv({
        latencyLogging: false,
        enableAutoPipelining: true,
      });

      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(0);

      // 2500 commands should result in 3 pipelines: 1000 + 1000 + 500
      const totalCommands = MAX_PIPELINE_SIZE * 2 + 500;
      const promises = Array.from({ length: totalCommands }, (_, i) => redis.echo(`msg-${i}`));
      const results = await Promise.all(promises);

      for (let i = 0; i < totalCommands; i++) {
        expect(results[i]).toBe(`msg-${i}`);
      }

      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(3);
    });
  });

  describe("read/write pipeline separation", () => {
    test("should split a Promise.all of mixed reads and writes into one read pipeline and one write pipeline", async () => {
      const redis = Redis.fromEnv({
        latencyLogging: false,
        enableAutoPipelining: true,
      });

      const key = newKey();

      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(0);

      // mix reads and writes in one Promise.all
      const [setRes, _getRes, echoRes, incrRes] = await Promise.all([
        redis.set(key, "hello"),
        redis.get(key),
        redis.echo("test"),
        redis.incr(newKey()),
      ]);

      expect(setRes).toBe("OK");
      expect(echoRes).toBe("test");
      expect(incrRes).toBe(1);

      // 2 pipelines: one for reads (get, echo), one for writes (set, incr)
      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(2);
    });

    test("should batch a Promise.all of only reads into a single read pipeline", async () => {
      const redis = Redis.fromEnv({
        latencyLogging: false,
        enableAutoPipelining: true,
      });

      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(0);

      const key = newKey();
      await redis.set(key, "value");
      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(1);

      const [getRes, echoRes, existsRes] = await Promise.all([
        redis.get(key),
        redis.echo("hello"),
        redis.exists(key),
      ]);

      expect(getRes).toBe("value");
      expect(echoRes).toBe("hello");
      expect(existsRes).toBe(1);

      // 1 pipeline for the reads (the set above was a separate await)
      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(2);
    });

    test("should batch a Promise.all of only writes into a single write pipeline", async () => {
      const redis = Redis.fromEnv({
        latencyLogging: false,
        enableAutoPipelining: true,
      });

      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(0);

      const [setRes, incrRes, appendRes] = await Promise.all([
        redis.set(newKey(), "value"),
        redis.incr(newKey()),
        redis.append(newKey(), "hello"),
      ]);

      expect(setRes).toBe("OK");
      expect(incrRes).toBe(1);
      expect(appendRes).toBe(5);

      // 1 pipeline for writes
      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(1);
    });

    test("should split a Promise.all of json.set and json.get into separate write and read pipelines", async () => {
      const redis = Redis.fromEnv({
        latencyLogging: false,
        enableAutoPipelining: true,
      });

      const key = newKey();

      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(0);

      const [setRes, _getRes] = await Promise.all([
        redis.json.set(key, "$", { hello: "world" }),
        redis.json.get(key),
      ]);

      expect(setRes).toBe("OK");

      // 2 pipelines: json.set is write, json.get is read
      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(2);
    });

    test("should route each queued command to the active read or write pipeline based on its type and preserve insertion order", async () => {
      const redis = Redis.fromEnv({
        latencyLogging: false,
        enableAutoPipelining: true,
      });

      // Kick off mixed reads and writes without awaiting — the synchronous
      // portion of withAutoPipeline runs immediately and adds each command
      // to the appropriate active pipeline.
      const promises = [
        redis.set("k1", "v1"), // write
        redis.incr("k2"), // write
        redis.get("k1"), // read
        redis.echo("hello"), // read
        redis.exists("k1"), // read
        redis.append("k3", "x"), // write
        redis.del("k4"), // write
      ];

      const executor = getExecutor(redis);
      const readPipeline = executor.activeReadPipeline;
      const writePipeline = executor.activeWritePipeline;

      expect(readPipeline).not.toBeNull();
      expect(writePipeline).not.toBeNull();

      expect(readPipeline!.length()).toBe(3);
      expect(writePipeline!.length()).toBe(4);

      const readCommands = readPipeline!.commands.map((c) => c.command[0]);
      const writeCommands = writePipeline!.commands.map((c) => c.command[0]);

      expect(readCommands).toEqual(["get", "echo", "exists"]);
      expect(writeCommands).toEqual(["set", "incr", "append", "del"]);

      await Promise.all(promises);
      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(2);
    });

    test("should leave the write pipeline null and queue all commands on the read pipeline when only reads are issued", async () => {
      const redis = Redis.fromEnv({
        latencyLogging: false,
        enableAutoPipelining: true,
      });

      const promises = [redis.get("a"), redis.get("b"), redis.echo("c"), redis.exists("a")];

      const executor = getExecutor(redis);

      expect(executor.activeWritePipeline).toBeNull();
      expect(executor.activeReadPipeline).not.toBeNull();
      expect(executor.activeReadPipeline!.length()).toBe(4);

      const readCommands = executor.activeReadPipeline!.commands.map((c) => c.command[0]);
      expect(readCommands).toEqual(["get", "get", "echo", "exists"]);

      await Promise.all(promises);
      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(1);
    });

    test("should leave the read pipeline null and queue all commands on the write pipeline when only writes are issued", async () => {
      const redis = Redis.fromEnv({
        latencyLogging: false,
        enableAutoPipelining: true,
      });

      const promises = [
        redis.set("a", "1"),
        redis.incr("b"),
        redis.append("c", "x"),
        redis.del("d"),
        redis.expire("a", 60),
      ];

      const executor = getExecutor(redis);

      expect(executor.activeReadPipeline).toBeNull();
      expect(executor.activeWritePipeline).not.toBeNull();
      expect(executor.activeWritePipeline!.length()).toBe(5);

      const writeCommands = executor.activeWritePipeline!.commands.map((c) => c.command[0]);
      expect(writeCommands).toEqual(["set", "incr", "append", "del", "expire"]);

      await Promise.all(promises);
      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(1);
    });

    test("should route JSON.GET/ARRLEN/OBJKEYS to the read pipeline and JSON.SET/ARRAPPEND/MERGE to the write pipeline", async () => {
      const redis = Redis.fromEnv({
        latencyLogging: false,
        enableAutoPipelining: true,
      });

      const key = newKey();

      const promises = [
        redis.json.set(key, "$", { value: 1 }), // write
        redis.json.get(key), // read
        redis.json.arrappend(key, "$.list", '"a"'), // write
        redis.json.arrlen(key, "$.list"), // read
        redis.json.objkeys(key), // read
        redis.json.merge(key, "$", { extra: 2 }), // write
      ];

      const executor = getExecutor(redis);

      expect(executor.activeReadPipeline).not.toBeNull();
      expect(executor.activeWritePipeline).not.toBeNull();
      expect(executor.activeReadPipeline!.length()).toBe(3);
      expect(executor.activeWritePipeline!.length()).toBe(3);

      const readCommands = executor.activeReadPipeline!.commands.map((c) => c.command[0]);
      const writeCommands = executor.activeWritePipeline!.commands.map((c) => c.command[0]);

      // JSON commands serialize as `JSON.<subcommand>` at the wire level
      expect(readCommands).toEqual(["JSON.GET", "JSON.ARRLEN", "JSON.OBJKEYS"]);
      expect(writeCommands).toEqual(["JSON.SET", "JSON.ARRAPPEND", "JSON.MERGE"]);

      await Promise.all(promises).catch(() => {
        // The actual responses don't matter for routing assertions; some commands
        // may error against a fresh key, which is fine.
      });
    });
  });

  describe("excluded commands", () => {
    test("should auto-pipeline set rather than treat it as an excluded command", async () => {
      const redis = Redis.fromEnv();
      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(0);

      await redis.set("foo", "bar");

      // @ts-expect-error pipelineCounter is not in type but accessible
      expect(redis.pipelineCounter).toBe(1);
    });

    test("should bypass auto-pipelining for scan, keys, flushdb, flushall, dbsize, and exec", async () => {
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
