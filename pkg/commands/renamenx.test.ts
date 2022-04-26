import { keygen, newHttpClient } from "../test-utils.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { RenameNXCommand } from "./renamenx.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when the key exists", () => {
  it("does nothing", async () => {
    const source = newKey();
    const destination = newKey();
    const sourceValue = Math.random().toString();
    const destinationValue = Math.random().toString();
    await new SetCommand(source, sourceValue).exec(client);
    await new SetCommand(destination, destinationValue).exec(client);
    const res = await new RenameNXCommand(source, destination).exec(client);
    assertEquals(res, 0);
  });
});
describe("when the key does not exist", () => {
  it("renames the key", async () => {
    const source = newKey();
    const destination = newKey();
    const value = Math.random().toString();
    await new SetCommand(source, value).exec(client);
    const res = await new RenameNXCommand(source, destination).exec(client);
    assertEquals(res, 1);
  });
});
