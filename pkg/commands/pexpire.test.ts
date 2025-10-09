import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { GetCommand } from "./get";
import { PExpireCommand } from "./pexpire";
import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  test("expires a key correctly", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    const res = await new PExpireCommand([key, 1000]).exec(client);
    expect(res).toEqual(1);
    await new Promise((res) => setTimeout(res, 2000));
    const res2 = await new GetCommand([key]).exec(client);

    expect(res2).toEqual(null);
  });
});
test("with NX option", async () => {
  const key = newKey();
  const value = randomID();
  await new SetCommand([key, value]).exec(client);

  const res = await new PExpireCommand([key, 1000, "NX"]).exec(client);
  expect(res).toEqual(1);

  const res2 = await new PExpireCommand([key, 2000, "NX"]).exec(client);
  expect(res2).toEqual(0);
});

test("with XX option", async () => {
  const key = newKey();
  const value = randomID();
  await new SetCommand([key, value]).exec(client);

  const res = await new PExpireCommand([key, 1000, "XX"]).exec(client);
  expect(res).toEqual(0);

  const res2 = await new PExpireCommand([key, 1000]).exec(client);
  expect(res2).toEqual(1);

  const res3 = await new PExpireCommand([key, 2000, "XX"]).exec(client);
  expect(res3).toEqual(1);
});
test("with GT option", async () => {
  const key = newKey();
  const value = randomID();
  await new SetCommand([key, value]).exec(client);

  // Set an initial expiry
  const initialExpiry = await new PExpireCommand([key, 2000]).exec(client);
  expect(initialExpiry).toEqual(1);

  // Attempt to set a shorter expiry with GT
  const res1 = await new PExpireCommand([key, 1000, "GT"]).exec(client);
  expect(res1).toEqual(0);

  // Attempt to set a longer expiry with GT
  const res2 = await new PExpireCommand([key, 3000, "GT"]).exec(client);
  expect(res2).toEqual(1);
});

test("with LT option", async () => {
  const key = newKey();
  const value = randomID();
  await new SetCommand([key, value]).exec(client);

  // Set an initial expiry
  const initialExpiry = await new PExpireCommand([key, 3000]).exec(client);
  expect(initialExpiry).toEqual(1);

  // Attempt to set a longer expiry with LT
  const res1 = await new PExpireCommand([key, 4000, "LT"]).exec(client);
  expect(res1).toEqual(0);

  // Attempt to set a shorter expiry with LT
  const res2 = await new PExpireCommand([key, 2000, "LT"]).exec(client);
  expect(res2).toEqual(1);
});

test("key does not exist", async () => {
  const key = newKey();

  const res = await new PExpireCommand([key, 1000]).exec(client);
  expect(res).toEqual(0);
});
