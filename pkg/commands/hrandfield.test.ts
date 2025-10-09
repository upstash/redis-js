import { afterAll, expect, test, describe } from "bun:test";
import { keygen, newHttpClient, randomID } from "../test-utils";
import { HRandFieldCommand } from "./hrandfield";
import { HSetCommand } from "./hset";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
describe("with single field present", () => {
  test("returns the field", async () => {
    const key = newKey();
    const field1 = randomID();
    const value1 = randomID();
    await new HSetCommand([key, { [field1]: value1 }]).exec(client);

    const res = await new HRandFieldCommand([key]).exec(client);

    expect(res).toEqual(field1);
  });
});

describe("with multiple fields present", () => {
  test("returns a random field", async () => {
    const key = newKey();
    const fields: Record<string, string> = {};
    for (let i = 0; i < 10; i++) {
      fields[randomID()] = randomID();
    }
    await new HSetCommand([key, fields]).exec(client);

    const res = await new HRandFieldCommand<string>([key]).exec(client);

    expect(fields).toHaveProperty(res);
  });
});

describe("with withvalues", () => {
  test("returns a subset with values", async () => {
    const key = newKey();
    const fields: Record<string, string> = {};
    for (let i = 0; i < 10; i++) {
      fields[randomID()] = randomID();
    }
    await new HSetCommand([key, fields]).exec(client);

    const res = await new HRandFieldCommand<Record<string, string>>([key, 2, true]).exec(client);
    for (const [k, v] of Object.entries(res)) {
      expect(fields).toHaveProperty(k);
      expect(fields[k]).toEqual(v);
    }
  });
});
describe("when hash does not exist", () => {
  test("it returns null", async () => {
    const res = await new HRandFieldCommand([randomID()]).exec(client);
    expect(res).toEqual(null);
  });
});
