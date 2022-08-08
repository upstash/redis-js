import { Redis } from "./redis.ts";
import { keygen, newHttpClient, randomID } from "./test-utils.ts";
import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.141.0/testing/asserts.ts";
import { afterEach } from "https://deno.land/std@0.141.0/testing/bdd.ts";
const client = newHttpClient();

const { cleanup } = keygen();
afterEach(cleanup);

Deno.test("create a new script", async (t) => {
  await t.step("creates a new script", async () => {
    const redis = new Redis(client);
    const script = redis.createScript("return ARGV[1];");

    const res = await script.eval([], ["Hello World"]);
    assertEquals(res, "Hello World");
  });
});

Deno.test("sha1", async (t) => {
  await t.step("calculates the correct sha1", async () => {
    const redis = new Redis(client);
    const script = redis.createScript(
      "The quick brown fox jumps over the lazy dog",
    );

    const sha1 = await script.sha1();
    assertEquals(sha1, "2fd4e1c67a2d28fced849ee1bb76e7391b93eb12");
  });

  await t.step("calculates the correct sha1 for empty string", async () => {
    const redis = new Redis(client);
    const script = redis.createScript("");

    const sha1 = await script.sha1();
    assertEquals(sha1, "da39a3ee5e6b4b0d3255bfef95601890afd80709");
  });
});

Deno.test("script gets loaded", async (t) => {
  await t.step("following evalsha command is a hit", async () => {
    const id = randomID();
    const s = `return "${id}";`;
    const redis = new Redis(client);
    const script = redis.createScript(s);

    await assertRejects(async () => await script.evalsha([], []));
    const res = await script.exec([], []);
    assertEquals(res, id);

    const res2 = await script.evalsha([], []);
    assertEquals(res2, id);
  });
});
