import { set } from "../src";
import { nanoid } from "nanoid";

describe("promise then", () => {
  it("basic", (done) => {
    const key = nanoid();

    set(key, "hello")
      .then(({ data }) => {
        expect(data).toBe("OK");
      })
      .finally(() => {
        done();
      });
  });
});
