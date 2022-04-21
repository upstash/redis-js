import { keygen, newHttpClient } from "../test-utils";
import { it, describe, expect, afterAll } from "@jest/globals";
import { HSetCommand } from "./hset";
import { HScanCommand } from "./hscan";
const client = newHttpClient();

const { newKey, cleanup } = keygen()
afterAll(cleanup)
describe("without options", () => {
  it("returns cursor and members", async () => {
    const key = newKey()
    await new HSetCommand([key, { field: "value" }]).exec(client)
    const res = await new HScanCommand([key, 0]).exec(client)

				expect(res).toBeDefined();
				expect(res.length).toBe(2);
				expect(typeof res[0]).toBe("number");
				expect(res![1].length).toBeGreaterThan(0);
			},
		);
	},
);

describe("with match", () => {
  it("returns cursor and members", async () => {
    const key = newKey()
    await new HSetCommand([key, { field: "value" }]).exec(client)
    const res = await new HScanCommand([key, 0, { match: "field" }]).exec(client)

				expect(res).toBeDefined();
				expect(res.length).toBe(2);
				expect(typeof res[0]).toBe("number");
				expect(res![1].length).toBeGreaterThan(0);
			},
		);
	},
);

describe("with count", () => {
  it("returns cursor and members", async () => {
    const key = newKey()
    await new HSetCommand([key, { field: "value" }]).exec(client)
    const res = await new HScanCommand([key, 0, { count: 1 }]).exec(client)

				expect(res).toBeDefined();
				expect(res.length).toBe(2);
				expect(typeof res[0]).toBe("number");
				expect(res![1].length).toBeGreaterThan(0);
			},
		);
	},
);
