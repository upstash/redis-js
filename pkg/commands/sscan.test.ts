import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { it, describe, expect, afterAll } from "@jest/globals";
import { SAddCommand } from "./sadd";
import { SScanCommand } from "./sscan";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
describe(
	"without options",
	() => {
		it(
			"returns cursor and members",
			async () => {
				const key = newKey();
				const member = randomUUID();
				await new SAddCommand(key, member).exec(client);
				const res = await new SScanCommand(key, 0).exec(client);

				expect(res).toBeDefined();
				expect(res.length).toBe(2);
				expect(typeof res[0]).toBe("number");
				expect(res![1].length).toBeGreaterThan(0);
			},
		);
	},
);

describe(
	"with match",
	() => {
		it(
			"returns cursor and members",
			async () => {
				const key = newKey();
				const member = randomUUID();
				await new SAddCommand(key, member).exec(client);
				const res = await new SScanCommand(key, 0, { match: member }).exec(
					client,
				);

				expect(res).toBeDefined();
				expect(res.length).toBe(2);
				expect(typeof res[0]).toBe("number");
				expect(res![1].length).toBeGreaterThan(0);
			},
		);
	},
);

describe(
	"with count",
	() => {
		it(
			"returns cursor and members",
			async () => {
				const key = newKey();
				const member = randomUUID();
				await new SAddCommand(key, member).exec(client);
				const res = await new SScanCommand(key, 0, { count: 1 }).exec(client);

				expect(res).toBeDefined();
				expect(res.length).toBe(2);
				expect(typeof res[0]).toBe("number");
				expect(res![1].length).toBeGreaterThan(0);
			},
		);
	},
);
