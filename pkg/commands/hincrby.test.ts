import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { it, expect, afterAll } from "@jest/globals";

import { HSetCommand } from "./hset";
import { HIncrByCommand } from "./hincrby";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("increments a non-existing value", async () => {
  const key = newKey()
  const field = randomUUID()
  const res = await new HIncrByCommand([key, field, 2]).exec(client)

		expect(res).toEqual(2);
	},
);

it("increments and existing value", async () => {
  const key = newKey()
  const field = randomUUID()
  await new HSetCommand([key, { [field]: 5 }]).exec(client)
  const res = await new HIncrByCommand([key, field, 2]).exec(client)

		expect(res).toEqual(7);
	},
);
