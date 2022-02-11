import { afterEach, describe, expect, test } from "@jest/globals"

import { randomUUID } from "crypto"
import { newHttpClient } from "../test_setup"

import { DelCommand, ExistsCommand, ExpireCommand } from "./keys"
import { SetCommand, GetCommand } from "./strings"

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

describe("del", () => {
  describe("when key does not exist", () => {
    test("does nothing", async () => {
      const key = newKey()

      const res = await new DelCommand(key).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result).toEqual(0)
    })
  })
  describe("when key does exist", () => {
    test("deletes the key", async () => {
      const key = newKey()
      await new SetCommand(key, "value").exec(client)
      const res = await new DelCommand(key).exec(client)
      expect(res.error).not.toBeDefined()
      expect(res.result).toEqual(1)
    })
  })
  describe("with multiple keys", () => {
    describe("when one does not exist", () => {
      test("deletes all keys", async () => {
        const key1 = newKey()
        const key2 = newKey()
        await new SetCommand(key1, "value").exec(client)
        const res = await new DelCommand(key1, key2).exec(client)
        expect(res.error).not.toBeDefined()
        expect(res.result).toEqual(1)
      })
    })
  })
})

describe("exists", () => {
  describe("when the key does not eist", () => {
    test("it returns 1", async () => {
      const key = newKey()

      const res = await new ExistsCommand(key).exec(client)
      expect(res.error).toBeUndefined()
      expect(res.result).toEqual(0)
    })
  })
  describe("when the key exists", () => {
    test("it returns 1", async () => {
      const key = newKey()
      await new SetCommand(key, "value").exec(client)
      const res = await new ExistsCommand(key).exec(client)
      expect(res.error).toBeUndefined()
      expect(res.result).toEqual(1)
    })
  })
  describe("with multiple keys", () => {
    test("it returns the number of found keys", async () => {
      const key1 = newKey()
      const key2 = newKey()
      const key3 = newKey()
      await new SetCommand(key1, "value").exec(client)
      await new SetCommand(key2, "value").exec(client)
      const res = await new ExistsCommand(key1, key2, key3).exec(client)
      expect(res.error).toBeUndefined()
      expect(res.result).toEqual(2)
    })
  })
})

describe("expire", () => {
  test("expires a key correctly", async () => {
    const key = newKey()
    const value = randomUUID()
    await new SetCommand(key, value).exec(client)
    const res = await new ExpireCommand(key, 1).exec(client)
    expect(res.error).toBeUndefined()
    expect(res.result).toEqual(1)
    await new Promise((res) => setTimeout(res, 2000))
    const res2 = await new GetCommand(key).exec(client)
    expect(res2.error).toBeUndefined()
    expect(res2.result).toBeNull()
  })
})
