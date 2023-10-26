import { newHttpClient } from "../test-utils";
import { FlushAllCommand } from "./flushall";

import { describe, expect, test } from "bun:test";
const client = newHttpClient();

describe("without options", () => {
  test("flushes the db", async () => {
    const res = await new FlushAllCommand().exec(client);
    expect(res).toEqual("OK");
  });
});
describe("async", () => {
  test("flushes the db", async () => {
    const res = await new FlushAllCommand([{ async: true }]).exec(client);
    expect(res).toEqual("OK");
  });
});
