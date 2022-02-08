import { set, decr } from "../../src";
import { nanoid } from "nanoid";

describe("decr command", () => {
  it("basic", async () => {
    const key = nanoid();

    await set(key, "100");

    const { data } = await decr(key);
    expect(data).toBe(99);
  });
});
