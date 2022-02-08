import { flushall } from "../../src";

describe("flushdb command", () => {
  it("delete all keys and all database", async () => {
    const { data } = await flushall();
    expect(data).toBe("OK");
  });
});
