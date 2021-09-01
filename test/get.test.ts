import { get } from "../src";

test("api connection succeed", async () => {
  const { data } = await get("key2");
  expect("hey").toEqual(data);
});
