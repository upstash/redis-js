import { expect, test } from "bun:test";
import { newHttpClient } from "../test-utils";
import { ScriptLoadCommand } from "./script_load";

const client = newHttpClient();

test("returns the hash", async () => {
  const script = "return ARGV[1]";
  const res = await new ScriptLoadCommand([script]).exec(client);
  expect(res).toEqual("098e0f0d1448c0a81dafe820f66d460eb09263da");
});
