import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { describe, it, expect, afterAll } from "@jest/globals";
import { ZAddCommand } from "./zadd";
import { ZPopMinCommand } from "./zpopmin";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
	"without options",
	() => {
		it(
			"returns the popped elements",
			async () => {
				const key = newKey();
				const score1 = 1;
				const member1 = randomUUID();
				const score2 = 2;
				const member2 = randomUUID();
				const score3 = 3;
				const member3 = randomUUID();
				await new ZAddCommand(
					key,
					{ score: score1, member: member1 },
					{ score: score2, member: member2 },
					{ score: score3, member: member3 },
				).exec(client);
				const res = await new ZPopMinCommand(key).exec(client);
				expect(res).toEqual([member1, score1]);
			},
		);
	},
);

describe(
	"with count",
	() => {
		it(
			"returns the popped elements",
			async () => {
				const key = newKey();
				const score1 = 1;
				const member1 = randomUUID();
				const score2 = 2;
				const member2 = randomUUID();
				const score3 = 3;
				const member3 = randomUUID();
				await new ZAddCommand(
					key,
					{ score: score1, member: member1 },
					{ score: score2, member: member2 },
					{ score: score3, member: member3 },
				).exec(client);
				const res = await new ZPopMinCommand(key, 2).exec(client);
				expect(res).toEqual([member1, score1, member2, score2]);
			},
		);
	},
);
