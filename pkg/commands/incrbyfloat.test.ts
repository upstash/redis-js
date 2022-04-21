import { keygen, newHttpClient } from "../test-utils";
import { it, expect, afterAll } from "@jest/globals";
import { SetCommand } from "./set";

import { IncrByFloatCommand } from "./incrbyfloat";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
	"increments a non-existing value",
	async () => {
		const key = newKey();
		const res = await new IncrByFloatCommand(key, 2.5).exec(client);

		expect(res).toEqual(2.5);
	},
);

it(
	"increments and existing value",
	async () => {
		const key = newKey();
		await new SetCommand(key, 5).exec(client);
		const res = await new IncrByFloatCommand(key, 2.5).exec(client);

		expect(res).toEqual(7.5);
	},
);
