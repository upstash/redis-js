import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { RenameNXCommand } from "./renamenx";
import { SetCommand } from "./set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when the key exists", () => {
  test("does nothing", async () => {
    const source = newKey();
    const destination = newKey();
    const sourceValue = randomID();
    const destinationValue = randomID();
    await new SetCommand([source, sourceValue]).exec(client);
    await new SetCommand([destination, destinationValue]).exec(client);
    const res = await new RenameNXCommand([source, destination]).exec(client);
    expect(res).toEqual(0);
  });
});
describe("when the key does not exist", () => {
  test("renames the key", async () => {
    const source = newKey();
    const destination = newKey();
    const value = randomID();
    await new SetCommand([source, value]).exec(client);
    const res = await new RenameNXCommand([source, destination]).exec(client);
    expect(res).toEqual(1);
  });
});
