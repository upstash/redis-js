import { keygen, newHttpClient } from "./test-utils";

import { afterAll, describe, expect, test } from "bun:test";

import { SetCommand } from "./commands/set";
import { Redis } from "./redis";

const client = newHttpClient();
const { cleanup } = keygen();
afterAll(cleanup);
describe("Read Your Writes Feature", () => {
	test("successfully retrieves Upstash-Sync-Token in the response header and updates local state", async () => {

		const initialSync = client._upstashSyncToken;
		await new SetCommand(["key", "value"]).exec(client);
		const updatedSync = client._upstashSyncToken;
		await new SetCommand(["key", "value"]).exec(client);

		expect(updatedSync).not.toEqual(initialSync);
	});

	test("succesfully updates sync state with pipeline", async () => {
		const initialSync = client._upstashSyncToken;

		const { pipeline } = new Redis(client);
		const p = pipeline();

		p.set("key1", "value1");
		p.set("key2", "value2");
		p.set("key3", "value3");

		await p.exec();

		const updatedSync = client._upstashSyncToken;


		expect(initialSync).not.toEqual(updatedSync);
	});

	test("updates after each element of promise.all", async () => {

		let currentSync = client._upstashSyncToken;

		const promises = Array.from({ length: 3 }, (_, i) =>
			new SetCommand([`key${i}`, `value${i}`]).exec(client).then(() => {
				expect(client._upstashSyncToken).not.toEqual(currentSync);
				currentSync = client._upstashSyncToken;
			}),
		);

		await Promise.all(promises);
	});

	test("updates after successful lua script call", async () => {

		const s = `redis.call('SET', 'mykey', 'myvalue')
		return 1
		`

		const initialSync = client._upstashSyncToken;

		const redis = new Redis(client);
		const script = redis.createScript(s);

		await script.exec([], []);

		const updatedSync = client._upstashSyncToken;

		expect(updatedSync).not.toEqual(initialSync);

	})
});
