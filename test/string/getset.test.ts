import { get, getset, set } from "../../src";
import { nanoid } from "nanoid";

describe("getset command", () => {
  it("basic", async () => {
    const key = nanoid();
    const value1 = nanoid();
    const value2 = nanoid();

    await set(key, value1);

    const { data: data1 } = await getset(key, value2);
    expect(data1).toBe(value1);

    const { data: data2 } = await get(key);
    expect(data2).toBe(value2);
  });
});
