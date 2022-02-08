import { zadd, zrem } from "../../src";
import { nanoid } from "nanoid";

describe("zrem command", () => {
  it("basic", async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 1, "a", 2, "b", 3, "c");
    expect(addData).toBe(3);

    const { data } = await zrem(key, "a", "b", "d");
    expect(data).toBe(2);
  });
});
