import { afterEach, describe, expect, it } from "@jest/globals"

import { randomUUID } from "crypto"
import { newHttpClient } from "../test-utils"
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
} from "./strlen"
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
  it("appends to empty value", async () => {
    const key = newKey()
    const value = randomUUID()
    const res = await new AppendCommand(key, value).exec(client)
    expect(res.error).not.toBeDefined()
    expect(res.result).toEqual(value.length)
  })

  it("appends to existing value", async () => {
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

describe("msetnx", () => {
  it("sets values", async () => {
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

  it("does not set values if one key already exists", async () => {
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
  it("sets value", async () => {
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
    it("sets value", async () => {
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
    it("sets value", async () => {
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
    it("sets value", async () => {
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
      it("does nothing", async () => {
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
      it("overwrites key", async () => {
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
      it("overwrites key", async () => {
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
      it("does nothing", async () => {
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
  it("sets value", async () => {
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
  it("sets value", async () => {
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
  it("sets value", async () => {
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
  it("sets value", async () => {
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
  it("returns the correct length", async () => {
    const key = newKey()
    const value = "abcd"
    await new SetCommand(key, value).exec(client)
    const res = await new StrLenCommand(key).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toBe(value.length)
  })
})
