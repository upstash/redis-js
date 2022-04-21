import { keygen, newHttpClient } from "../test-utils";
import { ExistsCommand } from "./exists";
import { describe, it, expect, afterAll } from "@jest/globals";
import { SetCommand } from "./set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
	"when the key does not eist",
	() => {
		it(
			"it returns 1",
			async () => {
				const key = newKey();

				const res = await new ExistsCommand(key).exec(client);
				expect(res).toEqual(0);
			},
		);
	},
);
describe(
	"when the key exists",
	() => {
		it(
			"it returns 1",
			async () => {
				const key = newKey();
				await new SetCommand(key, "value").exec(client);
				const res = await new ExistsCommand(key).exec(client);
				expect(res).toEqual(1);
			},
		);
	},
);
describe(
	"with multiple keys",
	() => {
		it(
			"it returns the number of found keys",
			async () => {
				const key1 = newKey();
				const key2 = newKey();
				const key3 = newKey();
				await new SetCommand(key1, "value").exec(client);
				await new SetCommand(key2, "value").exec(client);
				const res = await new ExistsCommand(key1, key2, key3).exec(client);
				expect(res).toEqual(2);
			},
		);
	},
);
