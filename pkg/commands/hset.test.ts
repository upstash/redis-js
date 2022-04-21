import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { it, expect, afterAll } from "@jest/globals";
import { HSetCommand } from "./hset";
import { HGetCommand } from "./hget";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
it(
	"sets value",
	async () => {
		const key = newKey();
		const field = randomUUID();
		const value = randomUUID();

  const res = await new HSetCommand([key, { [field]: value }]).exec(client)

  expect(res).toEqual(1)
  const res2 = await new HGetCommand([key, field]).exec(client)

		expect(res2).toEqual(value);
	},
);
