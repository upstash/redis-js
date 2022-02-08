import { set, incr } from "../../src";
import { nanoid } from "nanoid";

describe("incr command", () => {
  it("basic", async () => {
    const key = nanoid();

    await set(key, 2);

    const { data } = await incr(key);
    expect(data).toBe(3);
  });
});
