import { newHttpClient } from "../test-utils";
import { PublishCommand } from "./publish";
import { it, expect } from "@jest/globals";

const client = newHttpClient();

it(
	"returns the number of clients that received the message",
	async () => {
		const res = await new PublishCommand("channel", "hello").exec(client);

		expect(typeof res).toBe("number");
	},
);
