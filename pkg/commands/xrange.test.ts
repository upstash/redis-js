import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { XAddCommand } from "./xadd.ts";
import { XRangeCommand } from "./xrange.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("without options", async (t) => {
  await t.step("returns the set", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    await new XAddCommand([key, "*", { [field1]: member1, [field2]: member2 }])
      .exec(client);

    const res = await new XRangeCommand([key, "-", "+"]).exec(client);
    console.log(res);
    assertEquals(Object.keys(res).length, 1);
    assertEquals(Object.values(res)[0], {
      [field1]: member1,
      [field2]: member2,
    });
  });
});

// Deno.test("limit", async (t) => {
//   await t.step("returns only the first 2", async () => {
//     const key = newKey();
//     for (let i = 0; i < 10; i++) {
//       await new ZAddCommand([key, { score: i, member: randomID() }]).exec(client);
//     }

//     const res = await new ZRangeCommand([
//       key,
//       0,
//       7,
//       {
//         byScore: true,
//         offset: 0,
//         count: 2,
//       },
//     ]).exec(client);
//     assertEquals(res.length, 2);
//   });
// });
