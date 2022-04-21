import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { describe, it, expect, afterAll } from "@jest/globals";
import { SAddCommand } from "./sadd";
import { SInterCommand } from "./sinter";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
	"with single set",
	() => {
		it(
			"returns the members of the set",
			async () => {
				const key = newKey();
				const value1 = { v: randomUUID() };
				const value2 = { v: randomUUID() };
				await new SAddCommand(key, value1, value2).exec(client);
				const res = await new SInterCommand<{ v: string }>(key).exec(client);
				expect(res).toHaveLength(2);
				expect(res.map(({ v }) => v).includes(value1.v)).toBe(true);
				expect(res.map(({ v }) => v).includes(value2.v)).toBe(true);
			},
		);
	},
);

describe(
	"with multiple sets",
	() => {
		it(
			"returns the members of the set",
			async () => {
				const key1 = newKey();
				const key2 = newKey();
				const value1 = { v: randomUUID() };
				const value2 = { v: randomUUID() };
				const value3 = { v: randomUUID() };
				await new SAddCommand(key1, value1, value2).exec(client);
				await new SAddCommand(key2, value2, value3).exec(client);
				const res = await new SInterCommand(key1, key2).exec(client);
				expect(res).toEqual([value2]);
			},
		);
	},
);
