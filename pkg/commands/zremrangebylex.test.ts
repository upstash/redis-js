import { keygen, newHttpClient } from "../test-utils";
import { it, expect, afterAll } from "@jest/globals";
import { ZAddCommand } from "./zadd";
import { ZRemRangeByLexCommand } from "./zremrangebylex";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
	"returns the number of elements removed",
	async () => {
		const key = newKey();
		await new ZAddCommand(
			key,
			{ score: 0, member: "aaaa" },
			{ score: 0, member: "b" },
			{ score: 0, member: "c" },
			{ score: 0, member: "d" },
			{ score: 0, member: "e" },
		).exec(client);

		const res = await new ZRemRangeByLexCommand(key, "[b", "[e").exec(client);
		expect(res).toBe(4);
	},
);
