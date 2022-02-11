import { afterEach, describe, expect, test } from "@jest/globals"

import { randomUUID } from "crypto"
import { newHttpClient } from "../test_setup"
import {
  AppendCommand,
  DecrByCommand,
  DecrCommand,
  GetCommand,
  GetRangeCommand,
  GetSetCommand,
  IncrByCommand,
  IncrByFloatCommand,
  IncrCommand,
  MGetCommand,
  MSetCommand,
  MSetNXCommand,
  PSetEXCommand,
  SetCommand,
  SetExCommand,
  SetNxCommand,
  SetRangeCommand,
  StrLenCommand,
} from "./strings"
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

describe("append", () => {
  test("appends to empty value", async () => {
    const key = newKey()
    const value = randomUUID()
    const res = await new AppendCommand(key, value).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(value.length)
  })

  test("appends to existing value", async () => {
    const key = newKey()
    const value = randomUUID()
    const res = await new AppendCommand(key, value).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(value.length)
    const res2 = await new AppendCommand(key, "_").exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual(value.length + 1)
  })
})

describe("decr", () => {
  test("decrements a non-existing value", async () => {
    const key = newKey()
    const res = await new DecrCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(-1)
  })

  test("decrements and existing value", async () => {
    const key = newKey()
    await new SetCommand(key, 4).exec(client)
    const res = await new DecrCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(3)
  })
})

describe("decrby", () => {
  test("decrements a non-existing value", async () => {
    const key = newKey()
    const res = await new DecrByCommand(key, 2).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(-2)
  })

  test("decrements and existing value", async () => {
    const key = newKey()
    await new SetCommand(key, 5).exec(client)
    const res = await new DecrByCommand(key, 2).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(3)
  })
})

describe("get", () => {
  test("gets an exiting value", async () => {
    const key = newKey()
    const value = randomUUID()
    await new SetCommand(key, value).exec(client)
    const res = await new GetCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(value)
  })

  test("gets a non-existing value", async () => {
    const key = newKey()
    const res = await new GetCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toBeNull()
  })

  test("gets an object", async () => {
    const key = newKey()
    const value = { v: randomUUID() }
    await new SetCommand(key, value).exec(client)
    const res = await new GetCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(value)
  })
})

describe("getrange", () => {
  test("gets an exiting value", async () => {
    const key = newKey()
    const value = randomUUID()
    await new SetCommand(key, value).exec(client)
    const res = await new GetRangeCommand(key, 2, 4).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toBeDefined()
    expect(res.result!.toString()).toEqual(value.slice(2, 5).toString())
  })

  test("gets a non-existing value", async () => {
    const key = newKey()
    const res = await new GetRangeCommand(key, 10, 24).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("")
  })
})

describe("getset", () => {
  test("overwrites the original value", async () => {
    const key = newKey()
    const value = randomUUID()
    const newValue = randomUUID()
    await new SetCommand(key, value).exec(client)
    const res = await new GetSetCommand(key, newValue).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(value)
    const res2 = await new GetCommand(key).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual(newValue)
  })
  test("sets a new value if empty", async () => {
    const key = newKey()
    const newValue = randomUUID()
    const res = await new GetSetCommand(key, newValue).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toBeNull()
    const res2 = await new GetCommand(key).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual(newValue)
  })
})

describe("incr", () => {
  test("increments a non-existing value", async () => {
    const key = newKey()
    const res = await new IncrCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(1)
  })

  test("increments and existing value", async () => {
    const key = newKey()
    await new SetCommand(key, 4).exec(client)
    const res = await new IncrCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(5)
  })
})

describe("incrby", () => {
  test("increments a non-existing value", async () => {
    const key = newKey()
    const res = await new IncrByCommand(key, 2).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(2)
  })

  test("increments and existing value", async () => {
    const key = newKey()
    await new SetCommand(key, 5).exec(client)
    const res = await new IncrByCommand(key, 2).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(7)
  })
})

describe("incrbyfloat", () => {
  test("increments a non-existing value", async () => {
    const key = newKey()
    const res = await new IncrByFloatCommand(key, 2.5).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(2.5)
  })

  test("increments and existing value", async () => {
    const key = newKey()
    await new SetCommand(key, 5).exec(client)
    const res = await new IncrByFloatCommand(key, 2.5).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(7.5)
  })
})

describe("mget", () => {
  test("gets exiting values", async () => {
    const key1 = newKey()
    const value1 = randomUUID()
    const key2 = newKey()
    const value2 = randomUUID()
    const res = await new MSetCommand(
      { key: key1, value: value1 },
      { key: key2, value: value2 },
    ).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    const res2 = await new MGetCommand(key1, key2).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual([value1, value2])
  })

  test("gets a non-existing value", async () => {
    const key = newKey()
    const res = await new MGetCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual([null])
  })

  test("gets an object", async () => {
    const key = newKey()
    const value = { v: randomUUID() }
    await new SetCommand(key, value).exec(client)
    const res = await new MGetCommand(key).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual([value])
  })
})

describe("mset", () => {
  test("gets exiting values", async () => {
    const key1 = newKey()
    const value1 = randomUUID()
    const key2 = newKey()
    const value2 = randomUUID()
    const res = await new MSetCommand(
      { key: key1, value: value1 },
      { key: key2, value: value2 },
    ).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    const res2 = await new MGetCommand(key1, key2).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual([value1, value2])
  })
})

describe("msetnx", () => {
  test("sets values", async () => {
    const key1 = newKey()
    const value1 = randomUUID()
    const key2 = newKey()
    const value2 = randomUUID()
    const res = await new MSetCommand(
      { key: key1, value: value1 },
      { key: key2, value: value2 },
    ).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    const res2 = await new MGetCommand(key1, key2).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual([value1, value2])
  })

  test("does not set values if one key already exists", async () => {
    const key1 = newKey()
    const value1 = randomUUID()
    const key2 = newKey()
    const value2 = randomUUID()
    await new SetCommand(key1, value1).exec(client)
    const res = await new MSetNXCommand(
      { key: key1, value: value1 },
      { key: key2, value: value2 },
    ).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(0)

    const res2 = await new GetCommand(key2).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toBeNull()
  })
})

describe("psetex", () => {
  test("sets value", async () => {
    const key = newKey()
    const value = randomUUID()

    const res = await new PSetEXCommand(key, 1000, value).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    await new Promise((res) => setTimeout(res, 2000))
    const res2 = await new GetCommand(key).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toBeNull()
  })
})

describe("set", () => {
  describe("without options", () => {
    test("sets value", async () => {
      const key = newKey()
      const value = randomUUID()

      const res = await new SetCommand(key, value).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result).toEqual("OK")
      const res2 = await new GetCommand(key).exec(client)
      expect(res2.error).not.toBeDefined()
      expect(res2.result).toEqual(value)
    })
  })
  describe("ex", () => {
    test("sets value", async () => {
      const key = newKey()
      const value = randomUUID()

      const res = await new SetCommand(key, value, { ex: 1 }).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result).toEqual("OK")
      const res2 = await new GetCommand(key).exec(client)
      expect(res2.error).not.toBeDefined()
      expect(res2.result).toEqual(value)
      await new Promise((res) => setTimeout(res, 2000))

      const res3 = await new GetCommand(key).exec(client)
      expect(res3.error).not.toBeDefined()
      expect(res3.result).toEqual(null)
    })
  })
  describe("px", () => {
    test("sets value", async () => {
      const key = newKey()
      const value = randomUUID()

      const res = await new SetCommand(key, value, { px: 1000 }).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result).toEqual("OK")
      const res2 = await new GetCommand(key).exec(client)
      expect(res2.error).not.toBeDefined()
      expect(res2.result).toEqual(value)
      await new Promise((res) => setTimeout(res, 2000))

      const res3 = await new GetCommand(key).exec(client)
      expect(res3.error).not.toBeDefined()
      expect(res3.result).toEqual(null)
    })
  })
  describe("nx", () => {
    describe("when key exists", () => {
      test("does nothing", async () => {
        const key = newKey()
        const value = randomUUID()
        const newValue = randomUUID()

        await new SetCommand(key, value).exec(client)
        const res = await new SetCommand(key, newValue, {
          nx: true,
        }).exec(client)
        expect(res.error).not.toBeDefined()
        expect(res.result).toBeNull()
        const res2 = await new GetCommand(key).exec(client)
        expect(res2.error).not.toBeDefined()
        expect(res2.result).toEqual(value)
      })
    })
    describe("when key does not exists", () => {
      test("overwrites key", async () => {
        const key = newKey()
        const value = randomUUID()

        const res = await new SetCommand(key, value, {
          nx: true,
        }).exec(client)
        expect(res.error).not.toBeDefined()
        expect(res.result).toEqual("OK")
        const res2 = await new GetCommand(key).exec(client)
        expect(res2.error).not.toBeDefined()
        expect(res2.result).toEqual(value)
      })
    })
  })
  describe("xx", () => {
    describe("when key exists", () => {
      test("overwrites key", async () => {
        const key = newKey()
        const value = randomUUID()
        const newValue = randomUUID()

        await new SetCommand(key, value).exec(client)
        const res = await new SetCommand(key, newValue, {
          xx: true,
        }).exec(client)
        expect(res.error).not.toBeDefined()
        expect(res.result).toEqual("OK")
        const res2 = await new GetCommand(key).exec(client)
        expect(res2.error).not.toBeDefined()
        expect(res2.result).toEqual(newValue)
      })
    })
    describe("when key does not exists", () => {
      test("does nothing", async () => {
        const key = newKey()
        const value = randomUUID()

        const res = await new SetCommand(key, value, {
          xx: true,
        }).exec(client)
        expect(res.error).not.toBeDefined()
        expect(res.result).toBeNull()
        const res2 = await new GetCommand(key).exec(client)
        expect(res2.error).not.toBeDefined()
        expect(res2.result).toBeNull()
      })
    })
  })
})

describe("setnx", () => {
  test("sets value", async () => {
    const key = newKey()
    const value = randomUUID()

    const res = await new SetCommand(key, value).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    const res2 = await new GetCommand(key).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual(value)
  })
})

describe("setex", () => {
  test("sets value", async () => {
    const key = newKey()
    const value = randomUUID()

    const res = await new SetExCommand(key, 1, value).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    await new Promise((res) => setTimeout(res, 2000))
    const res2 = await new GetCommand(key).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toBeNull()
  })
})
describe("setnx", () => {
  test("sets value", async () => {
    const key = newKey()
    const value = randomUUID()
    const newValue = randomUUID()

    const res = await new SetCommand(key, value).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    const res2 = await new SetNxCommand(key, newValue).exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual(0)
    const res3 = await new GetCommand(key).exec(client)
    expect(res3.error).not.toBeDefined()
    expect(res3.result).toEqual(value)
  })
})

describe("setrange", () => {
  test("sets value", async () => {
    const key = newKey()
    const value = "originalValue"

    const res = await new SetCommand(key, value).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual("OK")
    const res2 = await new SetRangeCommand(key, 4, "helloWorld").exec(client)
    expect(res2.error).not.toBeDefined()
    expect(res2.result).toEqual(14)
    const res3 = await new GetCommand(key).exec(client)
    expect(res3.error).not.toBeDefined()
    expect(res3.result).toEqual("orighelloWorld")
  })
})

describe("strlen", () => {
  test("returns the correct length", async () => {
    const key = newKey()
    const value = "abcd"
    await new SetCommand(key, value).exec(client)
    const res = await new StrLenCommand(key).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toBe(value.length)
  })
})
