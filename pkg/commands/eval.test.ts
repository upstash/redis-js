import { EvalCommand } from "./eval";
import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { describe, it, expect, afterAll } from "@jest/globals";
import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
	"without keys",
	() => {
		it(
			"returns something",
			async () => {
				const value = randomUUID();
				const res = await new EvalCommand("return ARGV[1]", [], [value]).exec(
					client,
				);
				expect(res).toEqual(value);
			},
		);
	},
);

describe(
	"with keys",
	() => {
		it(
			"returns something",
			async () => {
				const value = randomUUID();
				const key = newKey();
				await new SetCommand(key, value).exec(client);
				const res = await new EvalCommand(
					`return redis.call("GET", KEYS[1])`,
					[key],
					[],
				).exec(client);
				expect(res).toEqual(value);
			},
		);
	},
);
