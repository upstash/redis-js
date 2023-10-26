import { afterEach, describe, expect, test } from "bun:test";
import { Redis } from "./redis";
import { keygen, newHttpClient, randomID } from "./test-utils";
const client = newHttpClient();

const { cleanup } = keygen();
afterEach(cleanup);

describe("create a new script", () => {
  test("creates a new script", async () => {
    const redis = new Redis(client);
    const script = redis.createScript("return ARGV[1];");

    const res = await script.eval([], ["Hello World"]);
    expect(res).toEqual("Hello World");
  });
});

describe("sha1", () => {
  test("calculates the correct sha1", () => {
    const redis = new Redis(client);
    const script = redis.createScript("The quick brown fox jumps over the lazy dog");

    expect(script.sha1).toEqual("2fd4e1c67a2d28fced849ee1bb76e7391b93eb12");
  });

  test("calculates the correct sha1 for empty string", () => {
    const redis = new Redis(client);
    const script = redis.createScript("");

    expect(script.sha1).toEqual("da39a3ee5e6b4b0d3255bfef95601890afd80709");
  });
});

describe("script gets loaded", () => {
  test("following evalsha command is a hit", async () => {
    const id = randomID();
    const s = `return "${id}";`;
    const redis = new Redis(client);
    const script = redis.createScript(s);

    let hasThrown = false;

    await script.evalsha([], []).catch(() => {
      hasThrown = true;
    });
    expect(hasThrown).toBeTrue();
    const res = await script.exec([], []);
    expect(res).toEqual(id);

    const res2 = await script.evalsha([], []);
    expect(res2).toEqual(id);
  });
});
