import { keygen, newHttpClient } from "../test-utils";
import { it, expect, afterAll } from "@jest/globals";
import { ZIncrByComand } from "./zincrby";
import { ZAddCommand } from "./zadd";
import { randomUUID } from "crypto";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
	"increments and existing value",
	async () => {
		const key = newKey();
		const score = 1;
		const member = randomUUID();
		await new ZAddCommand(key, { score, member }).exec(client);
		const res = await new ZIncrByComand(key, 2, member).exec(client);

		expect(res).toEqual(3);
	},
);
