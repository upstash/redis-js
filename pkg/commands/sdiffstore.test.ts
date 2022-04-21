import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { it, expect, afterAll } from "@jest/globals";
import { SAddCommand } from "./sadd";
import { SDiffStoreCommand } from "./sdiffstore";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("returns the diff", async () => {
  const key1 = newKey()
  const member1 = randomUUID()
  const key2 = newKey()
  const member2 = randomUUID()
  const destination = newKey()
  await new SAddCommand([key1, member1]).exec(client)
  await new SAddCommand([key2, member2]).exec(client)
  const res = await new SDiffStoreCommand([destination, key1, key2]).exec(client)
  expect(res).toEqual(1)
})
