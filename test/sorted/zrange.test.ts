import { zadd, zrange } from "../../src";
import { nanoid } from "nanoid";

describe("zrange command", () => {
  it("basic", async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 10, "a", 5, "b");
    expect(addData).toBe(2);

    const { data: rangeData } = await zrange(key, 0, -1);
    expect(rangeData).toMatchObject(["b", "a"]);
  });

  it("with score", async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 10, "a", 5, "b", 15, "c");
    expect(addData).toBe(3);

    const { data: rangeData } = await zrange(key, 0, -1, "WITHSCORES");
    expect(rangeData).toMatchObject(["b", "5", "a", "10", "c", "15"]);
  });
});
