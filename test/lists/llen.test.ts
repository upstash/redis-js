import { llen, rpush } from "../../src";
import { nanoid } from "nanoid";

describe("llen command", () => {
  it("basic", async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, "Hello", "Upstash");
    expect(pushData).toBe(2);

    const { data } = await llen(myList);
    expect(data).toBe(2);
  });
});
