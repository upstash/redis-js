import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { describe, it, expect, afterAll } from "@jest/globals";
import { SetCommand } from "./set";
import { GetCommand } from "./get";
import { ExpireAtCommand } from "./expireat";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  it("expires the key", async () => {
    const key = newKey()
    const value = randomUUID()
    await new SetCommand([key, value]).exec(client)

    const res = await new ExpireAtCommand([key, 1]).exec(client)
    expect(res).toEqual(1)
    await new Promise((res) => setTimeout(res, 2000))
    const res2 = await new GetCommand([key]).exec(client)
    expect(res2).toBeNull
  })
})
