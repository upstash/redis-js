import { auth, get } from "../src";

test("api connection succeed", async () => {
  const url: string = process.env.UPSTASH_URL || "";
  const token: string = process.env.UPSTASH_TOKEN || "";

  auth(url, token);
  const { data } = await get("key2");

  expect("hey").toEqual(data);
});
