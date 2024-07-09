import { keygen, newHttpClient } from "./test-utils";

import { afterAll, describe, expect, test } from "bun:test";
// import { GetCommand } from "./get";
// import { SetCommand } from "./set";
import { SetCommand } from "./commands/set";
import { Redis } from "./redis";

const { cleanup } = keygen();
afterAll(cleanup);
describe("Read Your Writes", () => {
	test("successfully retrieves Upstash-Sync-Token in the response header and updates local state", async () => {
		const client = newHttpClient();
		const initialSync = client._upstashSyncToken;
		await new SetCommand(["key", "value"]).exec(client);
		const updatedSync = client._upstashSyncToken;
		await new SetCommand(["key", "value"]).exec(client);

		expect(updatedSync).not.toEqual(initialSync);
	});

	test.skip("succesfully updates sync state with pipeline", async () => {
		const client = newHttpClient();

		await new SetCommand(["key", "value"]).exec(client);
		const initialSync1 = client._upstashSyncToken;
		console.log("initialSync1", initialSync1);

		const initialSync = client._upstashSyncToken;
		console.log("initialSync", initialSync);
		const { pipeline } = new Redis(client);
		const p = pipeline();

		p.set("key1", "value1");
		p.set("key2", "value2");
		p.set("key3", "value3");
		p.set("key4", "value4");
		p.set("key5", "value5");

		await p.exec();

		const updatedSync = client._upstashSyncToken;

		await new SetCommand(["key", "value"]).exec(client);
		const updatedSync2 = client._upstashSyncToken;

		console.log("updatedSync", updatedSync);
		console.log("updatedSync2", updatedSync2);
	});

	test("updates after each element of promise.all", async () => {
		const client = newHttpClient();
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

		const client = newHttpClient();
		await new SetCommand(["key", "value"]).exec(client);
		const initialSync = client._upstashSyncToken;

		const redis = new Redis(client);
		const script = redis.createScript(s);

		await script.exec([], []);

		const updatedSync = client._upstashSyncToken;

		expect(updatedSync).not.toEqual(initialSync);


	})
});
