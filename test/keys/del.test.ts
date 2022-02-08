import { mset, del } from "../../src";
import { nanoid } from "nanoid";

describe("del command", () => {
  it("basic", async () => {
    const key1 = nanoid();
    const key2 = nanoid();
    const key3 = nanoid();

    await mset(key1, "value", key2, "value");

    const { data } = await del(key1, key2, key3);
    expect(data).toBe(2);
  });
});
