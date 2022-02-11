import { afterEach, describe, expect, test } from "@jest/globals"

import { randomUUID } from "crypto"
import { newHttpClient } from "../test_setup"
import {
  HDelCommand,
  HExistsCommand,
  HGetAllCommand,
  HGetCommand,
  HIncrByCommand,
  HIncrByFloatCommand,
  HKeysCommand,
  HLenCommand,
  HMGetCommand,
  HMSetCommand,
  HScanCommand,
  HSetCommand,
  HSetNXCommand,
  HStrLenCommand,
  HValsCommand,
} from "./hash"
import { DelCommand } from "./keys"

const client = newHttpClient()
const generatedKeys: string[] = []
const newKey = () => {
  const key = randomUUID()
  generatedKeys.push(key)
  return key
}

afterEach(async () => {
  await new DelCommand(...generatedKeys).exec(client)
})

describe("hdel", () => {
  test("deletes a hash that does not exist", async () => {
    const key = newKey()
    const field = randomUUID()
    const res = await new HDelCommand(key, field).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(0)
  })

  test("deletes a field that exists", async () => {
    const key = newKey()
    const field = randomUUID()
    await new HSetCommand(key, field, randomUUID()).exec(client)
    const res = await new HDelCommand(key, field).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(1)
    const res2 = await new HGetCommand(key, field).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual(null)
  })
})

describe("hexists", () => {
  test("returns 1 for an existing field", async () => {
    const key = newKey()
    const field = randomUUID()
    await new HSetCommand(key, field, randomUUID()).exec(client)
    const res = await new HExistsCommand(key, field).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toEqual(1)
  })
  test("returns 0 if field does not exist", async () => {
    const key = newKey()
    await new HSetCommand(key, randomUUID(), randomUUID()).exec(client)

    const res = await new HExistsCommand(key, "not-existing-field").exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toEqual(0)
  })
  test("returns 0 if hash does not exist", async () => {
    const key = newKey()
    const field = randomUUID()
    const res = await new HExistsCommand(key, field).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toEqual(0)
  })
})

describe("hget", () => {
  test("gets an exiting value", async () => {
    const key = newKey()
    const field = randomUUID()
    const value = randomUUID()
    await new HSetCommand(key, field, value).exec(client)
    const res = await new HGetCommand(key, field).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(value)
  })

  test("gets a non-existing hash", async () => {
    const key = newKey()
    const field = randomUUID()
    const res = await new HGetCommand(key, field).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toBeNull()
  })

  test("gets a non-existing field", async () => {
    const key = newKey()
    const field = randomUUID()
    await new HSetCommand(key, randomUUID(), randomUUID()).exec(client)
    const res = await new HGetCommand(key, field).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toBeNull()
  })

  test("gets an object", async () => {
    const key = newKey()
    const field = randomUUID()
    const value = { v: randomUUID() }
    await new HSetCommand(key, field, value).exec(client)
    const res = await new HGetCommand(key, field).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(value)
  })
})

describe("hgetall", () => {
  test("returns all fields", async () => {
    const key = newKey()
    const field1 = randomUUID()
    const field2 = randomUUID()
    const value1 = false
    const value2 = true
    await new HSetCommand(key, field1, value1).exec(client)
    await new HSetCommand(key, field2, value2).exec(client)
    const res = await new HGetAllCommand<[string, boolean, string, boolean]>(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toBeDefined()
    expect(res.result?.includes(field1)).toBe(true)
    expect(res.result?.includes(field2)).toBe(true)
    expect(res.result?.includes(value1)).toBe(true)
    expect(res.result?.includes(value2)).toBe(true)
  })
  describe("when hash does not exist", () => {
    test("it returns an empty array", async () => {
      const res = await new HGetAllCommand(randomUUID()).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result).toBeDefined()
      expect(res.result!.length).toBe(0)
    })
  })
})

describe("hincrby", () => {
  test("increments a non-existing value", async () => {
    const key = newKey()
    const field = randomUUID()
    const res = await new HIncrByCommand(key, field, 2).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(2)
  })

  test("increments and existing value", async () => {
    const key = newKey()
    const field = randomUUID()
    await new HSetCommand(key, field, 5).exec(client)
    const res = await new HIncrByCommand(key, field, 2).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(7)
  })
})

describe("incrbyfloat", () => {
  test("increments a non-existing value", async () => {
    const key = newKey()
    const field = randomUUID()
    const res = await new HIncrByFloatCommand(key, field, 2.5).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(2.5)
  })

  test("increments and existing value", async () => {
    const key = newKey()
    const field = randomUUID()
    await new HSetCommand(key, field, 5).exec(client)
    const res = await new HIncrByFloatCommand(key, field, 2.5).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(7.5)
  })
})

describe("hkeys", () => {
  describe("with existing hash", () => {
    test("returns all keys", async () => {
      const key = newKey()
      const field1 = randomUUID()
      const field2 = randomUUID()
      await new HMSetCommand(
        key,
        { field: field1, value: randomUUID() },
        { field: field2, value: randomUUID() },
      ).exec(client)
      const res = await new HKeysCommand(key).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result?.includes(field1)).toBe(true)
      expect(res.result?.includes(field2)).toBe(true)
    })
  })
})

describe("hlen", () => {
  describe("with existing hash", () => {
    test("returns correct number of keys", async () => {
      const key = newKey()
      const field1 = randomUUID()
      const field2 = randomUUID()
      await new HMSetCommand(
        key,
        { field: field1, value: randomUUID() },
        { field: field2, value: randomUUID() },
      ).exec(client)
      const res = await new HLenCommand(key).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result).toEqual(2)
    })
  })
})

describe("hmget", () => {
  test("gets exiting values", async () => {
    const key = newKey()
    const field1 = randomUUID()
    const value1 = randomUUID()
    const field2 = randomUUID()
    const value2 = randomUUID()
    const res = await new HMSetCommand(
      key,
      { field: field1, value: value1 },
      { field: field2, value: value2 },
    ).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    const res2 = await new HMGetCommand(key, field1, field2).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual([value1, value2])
  })

  test("gets a non-existing value", async () => {
    const key = newKey()
    const res = await new HMGetCommand(key, randomUUID()).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual([null])
  })

  test("gets an object", async () => {
    const key = newKey()
    const field = randomUUID()
    const value = { v: randomUUID() }
    await new HSetCommand(key, field, value).exec(client)
    const res = await new HMGetCommand(key, field).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual([value])
  })
})

describe("hmset", () => {
  test("gets exiting values", async () => {
    const key = newKey()
    const field1 = randomUUID()
    const value1 = randomUUID()
    const field2 = randomUUID()
    const value2 = randomUUID()
    const res = await new HMSetCommand(
      key,
      { field: field1, value: value1 },
      { field: field2, value: value2 },
    ).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    const res2 = await new HMGetCommand(key, field1, field2).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual([value1, value2])
  })
})
describe("hscan", () => {
  test("returns cursor and keys", async () => {
    const key = newKey()
    const field = randomUUID()
    const value = randomUUID()
    await new HSetCommand(key, field, value).exec(client)
    const res = await new HScanCommand(key, 0).exec(client)
    expect(res.error).not.toBeDefined()

    expect(res.result).toBeDefined()
    expect(res.result!.length).toBe(2)
    expect(res.result![0]).toBe(0)
    expect(res.result![1]).toEqual([field, value])
  })
})
describe("hset", () => {
  test("sets value", async () => {
    const key = newKey()
    const field = randomUUID()
    const value = randomUUID()

    const res = await new HSetCommand(key, field, value).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(1)
    const res2 = await new HGetCommand(key, field).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual(value)
  })
})

describe("hsetnx", () => {
  describe("when hash exists already", () => {
    test("returns 0", async () => {
      const key = newKey()
      const field = randomUUID()
      const value = randomUUID()
      const newValue = randomUUID()
      await new HSetCommand(key, field, value).exec(client)
      const res = await new HSetNXCommand(key, field, newValue).exec(client)
      expect(res.error).toBeUndefined()
      expect(res.result).toBe(0)
      const res2 = await new HGetCommand(key, field).exec(client)
      expect(res2.error).toBeUndefined()
      expect(res2.result).toEqual(value)
    })
  })
  describe("when hash does not exist", () => {
    test("returns 1", async () => {
      const key = newKey()
      const field = randomUUID()
      const value = randomUUID()
      const res = await new HSetNXCommand(key, field, value).exec(client)
      expect(res.error).toBeUndefined()
      expect(res.result).toBe(1)
      const res2 = await new HGetCommand(key, field).exec(client)
      expect(res2.error).toBeUndefined()
      expect(res2.result).toEqual(value)
    })
  })
})
describe("hstrlen", () => {
  test("returns correct length", async () => {
    const key = newKey()
    const field = randomUUID()
    const value = randomUUID()

    const res = await new HStrLenCommand(key, field).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toBe(0)
    await new HSetCommand(key, field, value).exec(client)

    const res2 = await new HStrLenCommand(key, field).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toBe(36)
  })
})
describe("hvals", () => {
  test("returns correct length", async () => {
    const key = newKey()
    const field = randomUUID()
    const value = randomUUID()

    const res = await new HValsCommand(key).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toEqual([])
    await new HSetCommand(key, field, value).exec(client)

    const res2 = await new HValsCommand(key).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual([value])
  })
})
