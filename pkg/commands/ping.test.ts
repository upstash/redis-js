import { describe, expect, test } from "bun:test";
import { newHttpClient, randomID } from "../test-utils";
import { PingCommand } from "./ping";

const client = newHttpClient();

describe("with message", () => {
  test("returns the message", async () => {
    const message = randomID();
    const res = await new PingCommand([message]).exec(client);
    expect(res).toEqual(message);
  });
});
describe("without message", () => {
  test("returns pong", async () => {
    const res = await new PingCommand([]).exec(client);
    expect(res).toEqual("PONG");
  });
});
