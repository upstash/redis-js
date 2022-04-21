import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { it, expect, afterAll } from "@jest/globals";
import { SetCommand } from "./set";
import { GetCommand } from "./get";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
	"gets an exiting value",
	async () => {
		const key = newKey();
		const value = randomUUID();
		await new SetCommand(key, value).exec(client);
		const res = await new GetCommand(key).exec(client);

		expect(res).toEqual(value);
	},
);

it(
	"gets a non-existing value",
	async () => {
		const key = newKey();
		const res = await new GetCommand(key).exec(client);

		expect(res).toBeNull();
	},
);

it(
	"gets an object",
	async () => {
		const key = newKey();
		const value = { v: randomUUID() };
		await new SetCommand(key, value).exec(client);
		const res = await new GetCommand(key).exec(client);

		expect(res).toEqual(value);
	},
);
