import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { ZUnionCommand } from "./zunion.ts";
import { ZAddCommand } from "./zadd.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("command format", async (t) => {
  await t.step("without options", async (t) => {
    await t.step("builds the correct command", () => {
      assertEquals(new ZUnionCommand([1, "key"]).command, [
        "zunion",
        1,
        "key",
      ]);
    });
  });
  await t.step("with multiple keys", async (t) => {
    await t.step("builds the correct command", () => {
      assertEquals(
        new ZUnionCommand([2, ["key1", "key2"]]).command,
        ["zunion", 2, "key1", "key2"],
      );
    });
  });
  await t.step("with single weight", async (t) => {
    await t.step("builds the correct command", () => {
      assertEquals(
        new ZUnionCommand([1, "key", { weight: 4 }])
          .command,
        ["zunion", 1, "key", "weights", 4],
      );
    });
  });
  await t.step("with multiple weights", async (t) => {
    await t.step("builds the correct command", () => {
      assertEquals(
        new ZUnionCommand([2, ["key1", "key2"], {
          weights: [2, 3],
        }]).command,
        [
          "zunion",
          2,
          "key1",
          "key2",
          "weights",
          2,
          3,
        ],
      );
    });
    await t.step("with aggregate", async (t) => {
      await t.step("sum", async (t) => {
        await t.step("builds the correct command", () => {
          assertEquals(
            new ZUnionCommand([1, "key", {
              aggregate: "sum",
            }]).command,
            ["zunion", 1, "key", "aggregate", "sum"],
          );
        });
      });
      await t.step("min", async (t) => {
        await t.step("builds the correct command", () => {
          assertEquals(
            new ZUnionCommand([1, "key", {
              aggregate: "min",
            }]).command,
            ["zunion", 1, "key", "aggregate", "min"],
          );
        });
      });
      await t.step("max", async (t) => {
        await t.step("builds the correct command", () => {
          assertEquals(
            new ZUnionCommand([1, "key", {
              aggregate: "max",
            }]).command,
            ["zunion", 1, "key", "aggregate", "max"],
          );
        });
      });
    });
    await t.step("complex", async (t) => {
      await t.step("builds the correct command", () => {
        assertEquals(
          new ZUnionCommand([2, ["key1", "key2"], {
            weights: [4, 2],
            aggregate: "max",
          }]).command,
          [
            "zunion",
            2,
            "key1",
            "key2",
            "weights",
            4,
            2,
            "aggregate",
            "max",
          ],
        );
      });
    });
  });
});

Deno.test("without options", async (t) => {
  await t.step("returns the union", async () => {
    const key1 = newKey();
    const key2 = newKey();
    const score1 = 1;
    const member1 = randomID();
    const score2 = 2;
    const member2 = randomID();

    await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(
      client,
    );
    await new ZAddCommand([key2, { score: score2, member: member2 }]).exec(
      client,
    );

    const res = await new ZUnionCommand([2, [key1, key2]])
      .exec(
        client,
      );

    assertEquals(res.length, 2);
    assertEquals(res?.sort(), [member1, member2].sort());
  });
});

Deno.test("with weights", async (t) => {
  await t.step("returns the set", async () => {
    const key1 = newKey();
    const key2 = newKey();
    const score1 = 1;
    const member1 = randomID();
    const score2 = 2;
    const member2 = randomID();

    await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(
      client,
    );

    await new ZAddCommand([key2, { score: score2, member: member2 }]).exec(
      client,
    );

    const res = await new ZUnionCommand([2, [key1, key2], {
      weights: [2, 3],
    }]).exec(client);

    assertEquals(res.length, 2);
  });
});

Deno.test("aggregate", async (t) => {
  await t.step("sum", async (t) => {
    await t.step("returns the set", async () => {
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(
        client,
      );
      await new ZAddCommand([key2, { score: score2, member: member2 }]).exec(
        client,
      );

      const res = await new ZUnionCommand([2, [key1, key2], {
        aggregate: "sum",
      }]).exec(client);

      assertEquals(Array.isArray(res), true);
      assertEquals(res.length, 2);
    });
  });
  await t.step("min", async (t) => {
    await t.step("returns the set ", async () => {
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(
        client,
      );
      await new ZAddCommand([key2, { score: score2, member: member2 }]).exec(
        client,
      );

      const res = await new ZUnionCommand([2, [key1, key2], {
        aggregate: "min",
      }]).exec(client);
      assertEquals(res.length, 2);
    });
  });
  await t.step("max", async (t) => {
    await t.step("returns the set ", async () => {
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(
        client,
      );
      await new ZAddCommand([key2, { score: score2, member: member2 }]).exec(
        client,
      );

      const res = await new ZUnionCommand([2, [key1, key2], {
        aggregate: "max",
      }]).exec(client);
      assertEquals(res.length, 2);
    });
  });
});

Deno.test("withscores", async (t) => {
  await t.step("returns the set", async () => {
    const key1 = newKey();
    const score1 = 1;
    const member1 = randomID();

    const key2 = newKey();
    const member2 = randomID();
    const score2 = 5;

    await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(
      client,
    );

    await new ZAddCommand([key2, { score: score2, member: member2 }]).exec(
      client,
    );

    const res = await new ZUnionCommand([2, [key1, key2], {
      withScores: true,
    }]).exec(client);

    assertEquals(res.length, 4);
    assertEquals(res[0], member1);
    assertEquals(res[1], score1);
  });
});
