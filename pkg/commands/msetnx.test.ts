import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { it, expect, afterAll } from "@jest/globals";
import { MGetCommand } from "./mget";
import { SetCommand } from "./set";
import { GetCommand } from "./get";
import { MSetNXCommand } from "./msetnx";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
	"sets values",
	async () => {
		const key1 = newKey();
		const value1 = randomUUID();
		const key2 = newKey();
		const value2 = randomUUID();

		const kv: Record<string, string> = {};
		kv[key1] = value1;
		kv[key2] = value2;
		const res = await new MSetNXCommand(kv).exec(client);

		expect(res).toEqual(1);
		const res2 = await new MGetCommand<[string, string]>(key1, key2).exec(
			client,
		);

		expect(res2).toEqual([value1, value2]);
	},
);

it(
	"does not set values if one key already exists",
	async () => {
		const key1 = newKey();
		const value1 = randomUUID();
		const key2 = newKey();
		const value2 = randomUUID();
		await new SetCommand(key1, value1).exec(client);
		const kv: Record<string, string> = {};
		kv[key1] = value1;
		kv[key2] = value2;
		const res = await new MSetNXCommand(kv).exec(client);

		expect(res).toEqual(0);

		const res2 = await new GetCommand(key2).exec(client);

		expect(res2).toBeNull();
	},
);
