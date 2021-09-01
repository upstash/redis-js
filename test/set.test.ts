import { set } from "../src";

test("api connection succeed", async () => {
  const { data } = await set("key2", "hey");
  expect("OK").toEqual(data);
});
