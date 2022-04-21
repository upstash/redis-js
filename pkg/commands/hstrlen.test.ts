import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { it, expect, afterAll } from "@jest/globals";

import { HStrLenCommand } from "./hstrlen";
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

  const res = await new HStrLenCommand([key, field]).exec(client)
  expect(res).toBe(0)
  await new HSetCommand([key, { [field]: value }]).exec(client)

  const res2 = await new HStrLenCommand([key, field]).exec(client)

		expect(res2).toBe(36);
	},
);
