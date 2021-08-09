import { createClient } from "../src";

const URL = "https://eu1-fun-dodo-31346.upstash.io";
const TOKEN =
  "AXpyASQgZjQ4NDQzYTgtMjVhOC00NTVlLTlhMmMtOWViOTZjZWE0YjVjYjVmYWM1OTU3Njc2NGRmY2I0YjkwYTk4NmJlMDVkY2U=";

const upstash = createClient(URL, TOKEN);

test("api connection succeed", async () => {
  const { data, error, status } = await upstash.get("key2");
  console.log("status:", status, ", data:", data, ", error:", error);
  // expect(true).toEqual(true);
});
