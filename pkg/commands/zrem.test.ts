import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { it, expect, afterAll } from "@jest/globals";
import { ZAddCommand } from "./zadd";
import { ZRemCommand } from "./zrem";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
	"returns the number of removed members",
	async () => {
		const key = newKey();
		const member1 = randomUUID();
		const member2 = randomUUID();
		await new ZAddCommand(
			key,
			{ score: 1, member: member1 },
			{ score: 2, member: member2 },
		).exec(client);
		const res = await new ZRemCommand(key, member1, member2).exec(client);
		expect(res).toBe(2);
	},
);
