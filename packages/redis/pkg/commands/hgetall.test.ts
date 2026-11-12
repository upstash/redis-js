import { afterAll, expect, test, describe } from "bun:test";
import { keygen, newHttpClient, randomID, randomUnsafeIntegerString } from "../test-utils";
import { HGetAllCommand } from "./hgetall";
import { HSetCommand } from "./hset";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
test("returns all fields", async () => {
  const key = newKey();
  const field2 = randomID();
  const field1 = randomID();
  const value1 = false;
  const value2 = randomID();
  await new HSetCommand([key, { [field1]: value1, [field2]: value2 }]).exec(client);

  const res = await new HGetAllCommand([key]).exec(client);

  const obj = { [field1]: value1, [field2]: value2 };
  expect(res).toEqual(obj);
});
describe("when hash does not exist", () => {
  test("it returns null", async () => {
    const res = await new HGetAllCommand([randomID()]).exec(client);
    expect(res).toEqual(null);
  });
});
test("properly return bigint precisely", async () => {
  const key = newKey();
  const field3 = randomID();
  const field2 = randomID();
  const field1 = randomID();
  const value1 = false;
  const value2 = randomID();
  const value3 = randomUnsafeIntegerString();
  await new HSetCommand([key, { [field1]: value1, [field2]: value2, [field3]: value3 }]).exec(
    client
  );

  const res = await new HGetAllCommand([key]).exec(client);

  const obj = { [field1]: value1, [field2]: value2, [field3]: value3 };
  expect(res).toEqual(obj);
});

test("returns fields with special names like any other field", async () => {
  const key = newKey();
  const fields = Object.fromEntries([
    ["__proto__", { nested: true }],
    ["name", "value"],
  ]);
  await new HSetCommand([key, fields]).exec(client);

  const res = await new HGetAllCommand<Record<string, unknown>>([key]).exec(client);

  expect(Object.keys(res!).sort()).toEqual(["__proto__", "name"]);
  expect(Object.entries(res!).find(([field]) => field === "__proto__")?.[1]).toEqual({
    nested: true,
  });
  expect(res!.nested).toBeUndefined();
});
