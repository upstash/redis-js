import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { Redis } from "./redis";
import { keygen, newHttpClient, randomUnsafeIntegerString } from "./test-utils";

const client = newHttpClient();
const redis = new Redis(client);

const { newKey, cleanup } = keygen();
afterAll(cleanup);

function newLibraryName() {
  const raw = randomUnsafeIntegerString();
  // library names contain only letters, numbers, underscore
  const safe = raw.replaceAll(/\W/g, "n");
  return `testlib_${Date.now()}_${safe}`;
}

describe("redis.functions (integration)", () => {
  const lib = newLibraryName();

  const code = [
    `#!lua name=${lib}`,
    // Basic functions
    "redis.register_function('echo', function(keys, args) return args[1] end)",
    "redis.register_function('set_value', function(keys, args) return redis.call('SET', keys[1], args[1]) end)",
    // RO-flagged function (should work with FCALL_RO)
    "redis.register_function{function_name='ro_get', callback=function(keys, args) return redis.call('GET', keys[1]) end, flags={'no-writes'}}",
    // Function without no-writes flag (even though it only reads) -> should be rejected by FCALL_RO
    "redis.register_function('plain_get', function(keys, args) return redis.call('GET', keys[1]) end)",
    // Mis-flagged function: declares no-writes but attempts a write -> should error at runtime
    "redis.register_function{function_name='bad_ro_write', callback=function(keys, args) return redis.call('SET', keys[1], args[1]) end, flags={'no-writes'}}",
    "",
  ].join("\n");

  beforeAll(async () => {
    await redis.functions.load({ code, replace: true });
  });

  afterAll(async () => {
    await redis.functions.delete(lib).catch(() => {});
  });

  test("FUNCTION LOAD returns the library name", async () => {
    const res = await redis.functions.load({ code, replace: true });
    expect(res).toBe(lib);
  });

  test("FCALL works for read-write functions", async () => {
    const key = newKey();
    const value = `v_${Date.now()}`;

    const setRes = await redis.functions.call("set_value", [key], [value]);
    expect(setRes).toBe("OK");

    const getRes = await redis.get<string>(key);
    expect(getRes).toBe(value);
  });

  test("FCALL_RO works for no-writes functions; FCALL also works for them", async () => {
    const key = newKey();
    const value = `v_${Date.now()}`;
    await redis.set(key, value);

    const ro = await redis.functions.callRo("ro_get", [key], []);
    expect(ro).toBe(value);

    const nonRo = await redis.functions.call("ro_get", [key], []);
    expect(nonRo).toBe(value);
  });

  test("FCALL_RO allows a function that only reads even if it is not declared no-writes (Upstash behavior)", async () => {
    const key = newKey();
    const value = `v_${Date.now()}`;
    await redis.set(key, value);

    const res = await redis.functions.callRo("plain_get", [key], []);
    expect(res).toBe(value);
  });

  test("FCALL_RO rejects write functions (read-only context)", async () => {
    const key = newKey();
    const value = `v_${Date.now()}`;

    await expect(redis.functions.callRo("set_value", [key], [value])).rejects.toThrow(
      // Example error:
      // "ERR Error running script: @user_script:2: READONLY Write commands are not allowed from read-only scripts\nstack traceback:\n\t[G]: in function 'call'\n\t@user_script:2: in main chunk\n\t[G]: ?, command was: [\"fcall_ro\",\"set_value\",1,\"rJfH331J4VMkJtlOKphxw6Bl9oC2xq4mpO6Hw7LULlY=\",\"v_1765627271737\"]"
      "commands are not allowed from read-only"
    );
  });

  test("calling a no-write function with a callRo call rejects", async () => {
    const key = newKey();
    const value = `v_${Date.now()}`;

    await expect(redis.functions.callRo("bad_ro_write", [key], [value])).rejects.toThrow(
      "commands are not allowed from read-only"
    );
  });

  test("FUNCTION LIST returns the loaded libraries", async () => {
    const listRes = await redis.functions.list({ libraryName: lib, withCode: true });
    expect(listRes.length).toBeGreaterThan(0);
    expect(listRes[0]?.libraryName).toBe(lib);
    expect(listRes[0]?.engine).toBe("LUA");
    expect(listRes[0]?.libraryCode).toStartWith(`#!lua name=${lib}`);

    expect(listRes[0]?.functions.sort((a, b) => a.name.localeCompare(b.name))).toEqual([
      { name: "bad_ro_write", flags: ["no-writes"], description: undefined },
      { name: "echo", flags: [], description: undefined },
      { name: "plain_get", flags: [], description: undefined },
      { name: "ro_get", flags: ["no-writes"], description: undefined },
      { name: "set_value", flags: [], description: undefined },
    ]);
  });

  test("FUNCTION STATS returns the loaded libraries", async () => {
    const stats = await redis.functions.stats();
    expect(Object.keys(stats.engines).length).toBeGreaterThan(0);
    expect(stats.engines.LUA?.librariesCount).toBeGreaterThan(0);
    expect(stats.engines.LUA?.functionsCount).toBeGreaterThan(0);
    // Prefer camelCase
    expect((stats.engines as any).LUA?.libraries_count).toBeUndefined();
    expect((stats.engines as any).LUA?.functions_count).toBeUndefined();
  });

  test("FUNCTION DELETE removes the library", async () => {
    const libToDelete = newLibraryName();
    const codeToDelete = [
      `#!lua name=${libToDelete}`,
      "redis.register_function('f', function() return 'ok' end)",
      "",
    ].join("\n");

    await redis.functions.load({ code: codeToDelete, replace: true });

    const delRes = await redis.functions.delete(libToDelete);
    expect(delRes).toBe("OK");

    const listAfterDelete = await redis.functions.list({ libraryName: libToDelete });
    expect(listAfterDelete).toEqual([]);
  });
});
