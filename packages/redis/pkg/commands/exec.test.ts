import { keygen, newHttpClient, randomID } from "../test-utils";
import { afterAll, expect, test, describe } from "bun:test";
import { ExecCommand } from "./exec";
import { SetCommand } from "./set";

const client = newHttpClient();
const { newKey, cleanup } = keygen();

afterAll(cleanup);

describe("ExecCommand", () => {
  describe("basic string operations", () => {
    test("GET and SET", async () => {
      const key = newKey();
      const value = randomID();

      const setRes = await new ExecCommand<"OK">(["SET", key, value]).exec(client);
      expect(setRes).toEqual("OK");

      const getRes = await new ExecCommand<string | null>(["GET", key]).exec(client);
      expect(getRes).toEqual(value);
    });
  });

  describe("numeric operations", () => {
    test("INCR", async () => {
      const key = newKey();

      const incrRes = await new ExecCommand<number>(["INCR", key]).exec(client);
      expect(incrRes).toEqual(1);

      const incrRes2 = await new ExecCommand<number>(["INCR", key]).exec(client);
      expect(incrRes2).toEqual(2);
    });

    test("MEMORY USAGE", async () => {
      const key = newKey();
      const value = randomID();

      await new SetCommand([key, value]).exec(client);
      const memoryRes = await new ExecCommand<number | null>(["MEMORY", "USAGE", key]).exec(client);
      expect(typeof memoryRes).toEqual("number");
      expect(memoryRes).toBeGreaterThan(0);
    });
  });

  describe("array responses", () => {
    test("KEYS", async () => {
      const prefix = randomID();
      const keys = [`${prefix}:1`, `${prefix}:2`, `${prefix}:3`];

      // Set multiple keys
      for (const key of keys) {
        await new SetCommand([key, randomID()]).exec(client);
      }

      const keysRes = await new ExecCommand<string[]>(["KEYS", `${prefix}:*`]).exec(client);
      expect(keysRes.length).toEqual(3);
      expect(keysRes.sort()).toEqual(keys.sort());
    });
  });

  describe("error handling", () => {
    test("invalid command", async () => {
      const key = newKey();

      try {
        await new ExecCommand<any>(["INVALID_COMMAND", key]).exec(client);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test("wrong number of arguments", async () => {
      try {
        await new ExecCommand<any>(["GET"]).exec(client);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("argument type handling", () => {
    test("numeric arguments", async () => {
      const key = newKey();
      const score = 99.5;
      const member = randomID();

      const res = await new ExecCommand<number>(["ZADD", key, score, member]).exec(client);
      expect(res).toEqual(1);

      const scoreRes = await new ExecCommand<[string, number]>([
        "ZRANGE",
        key,
        0,
        -1,
        "WITHSCORES",
      ]).exec(client);

      expect(scoreRes[0]).toEqual(member);
      expect(scoreRes[1]).toEqual(score);
    });

    test("boolean arguments", async () => {
      const key = newKey();
      const value = randomID();

      const res = await new ExecCommand<"OK" | null>(["SET", key, value, "NX"]).exec(client);
      expect(res).toEqual("OK");

      // Second attempt should return null due to NX flag
      const res2 = await new ExecCommand<"OK" | null>(["SET", key, randomID(), "NX"]).exec(client);
      expect(res2).toEqual(null);
    });
  });
});
