import { describe, expect, test } from "bun:test";
import { newHttpClient } from "../test-utils";
import { FlushDBCommand } from "./flushdb";
const client = newHttpClient();

describe("without options", () => {
  test("flushes the db", async () => {
    const res = await new FlushDBCommand([]).exec(client);
    expect(res).toEqual("OK");
  });
});
describe("async", () => {
  test("flushes the db", async () => {
    const res = await new FlushDBCommand([{ async: true }]).exec(client);
    expect(res).toEqual("OK");
  });
});
