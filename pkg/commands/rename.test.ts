import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { it, expect, afterAll } from "@jest/globals";
import { SetCommand } from "./set";
import { RenameCommand } from "./rename";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
	"renames the key",
	async () => {
		const source = newKey();
		const destination = newKey();
		const value = randomUUID();
		await new SetCommand(source, value).exec(client);
		const res = await new RenameCommand(source, destination).exec(client);
		expect(res).toBe("OK");
	},
);
