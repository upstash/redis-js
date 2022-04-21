import { keygen, newHttpClient } from "../test-utils";
import { GetCommand } from "./get";
import { PExpireAtCommand } from "./pexpireat";
import { SetCommand } from "./set";
import { describe, it, expect, afterAll } from "@jest/globals";
import { randomUUID } from "crypto";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
	"without options",
	() => {
		it(
			"expires the key",
			async () => {
				const key = newKey();
				const value = randomUUID();
				await new SetCommand(key, value).exec(client);

				const res = await new PExpireAtCommand(key, 1000).exec(client);
				expect(res).toEqual(1);
				await new Promise((res) => setTimeout(res, 2000));
				const res2 = await new GetCommand(key).exec(client);
				expect(res2).toBeNull;
			},
		);
	},
);
