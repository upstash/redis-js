import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { it, expect, afterAll } from "@jest/globals";
import { HValsCommand } from "./hvals";
import { HSetCommand } from "./hset";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
	"returns correct length",
	async () => {
		const key = newKey();
		const field = randomUUID();
		const value = randomUUID();

  const res = await new HValsCommand([key]).exec(client)
  expect(res).toEqual([])
  await new HSetCommand([key, { [field]: value }]).exec(client)

  const res2 = await new HValsCommand([key]).exec(client)

		expect(res2).toEqual([value]);
	},
);
