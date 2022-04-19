import { Pipeline } from "./pipeline"
import { Redis } from "./redis"
import { keygen, newHttpClient } from "./test-utils"
import { describe, it, expect, afterEach } from "@jest/globals"
import { randomUUID } from "crypto"

const client = newHttpClient()

const { newKey, cleanup } = keygen()
afterEach(cleanup)

describe("with destructuring", () => {
  it("correctly binds this", async () => {
    const { pipeline } = new Redis(client)
    const p = pipeline()

    const { echo, exec } = p
    echo("Hello")

    const res = await exec()
    expect(res).toEqual(["Hello"])
  })
})

describe("with single command", () => {
  it("works with multiple commands", async () => {
    const p = new Pipeline(client)
    p.set(newKey(), randomUUID())
    const res = await p.exec()
    expect(res).toHaveLength(1)
    expect(res[0]).toBe("OK")
  })
})

describe("when chaining in a for loop", () => {
  it("works", async () => {
    const key = newKey()
    const res = await new Pipeline(client).set(key, randomUUID()).get(key).exec()

    expect(res).toHaveLength(2)
  })
})

describe("when chaining inline", () => {
  it("works", async () => {
    const key = newKey()
    const p = new Pipeline(client)
    for (let i = 0; i < 10; i++) {
      p.set(key, randomUUID())
    }

    const res = await p.exec()
    expect(res).toHaveLength(10)
  })
})

describe("when no commands were added", () => {
  it("throws", async () => {
    expect(() => new Pipeline(client).exec()).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Pipeline is empty"`,
    )
  })
})

describe("when one command throws an error", () => {
  it("throws", async () => {
    const p = new Pipeline(client).set("key", "value").hget("key", "field")
    expect(() => p.exec()).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Command 2 [ hget ] failed: WRONGTYPE Operation against a key holding the wrong kind of value"`,
    )
  })
})

describe("use all the things", () => {
  it("works", async () => {
    const p = new Pipeline(client)

    const persistentKey = newKey()
    const persistentKey2 = newKey()

    p.append(newKey(), "hello")
      .bitcount(newKey(), 0, 1)
      .bitop("and", newKey(), newKey())
      .bitpos(newKey(), 0, 1)
      .dbsize()
      .decr(newKey())
      .decrby(newKey(), 1)
      .del(newKey())
      .echo("hello")
      .eval("return ARGV[1]", 0, "Hello")
      .exists(newKey())
      .expire(newKey(), 5)
      .expireat(newKey(), Math.floor(new Date().getTime() / 1000) + 60)
      .flushall()
      .flushdb()
      .get(newKey())
      .getbit(newKey(), 0)
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
      .lpop(newKey())
      .lpush(persistentKey, "element")
      .lpushx(newKey(), "element1", "element2")
      .lrange(newKey(), 0, 1)
      .lrem(newKey(), 1, "value")
      .lset(persistentKey, "value", 0)
      .ltrim(newKey(), 0, 1)
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

    const res = await p.exec()
    expect(res).toHaveLength(109)
  })
})
