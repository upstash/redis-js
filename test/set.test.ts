import { set } from "../src";

test("redis set", async () => {
  const { data } = await set("key", "hey");
  expect("OK").toEqual(data);
});
