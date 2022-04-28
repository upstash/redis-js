import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ZInterStoreCommand } from "./zinterstore.ts";
import { ZAddCommand } from "./zadd.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("command format", async (t) => {
  await t.step("without options", async (t) => {
    await t.step("builds the correct command", () => {
      assertEquals(new ZInterStoreCommand("destination", 1, "key").command, [
        "zinterstore",
        "destination",
        "1",
        "key",
      ]);
    });
  });
  await t.step("with multiple keys", async (t) => {
    await t.step("builds the correct command", () => {
      assertEquals(
        new ZInterStoreCommand("destination", 2, ["key1", "key2"]).command,
        ["zinterstore", "destination", "2", "key1", "key2"],
      );
    });
  });
  await t.step("with single weight", async (t) => {
    await t.step("builds the correct command", () => {
      assertEquals(
        new ZInterStoreCommand("destination", 1, "key", { weight: 4 }).command,
        ["zinterstore", "destination", "1", "key", "weights", "4"],
      );
    });
  });
  await t.step("with multiple weights", async (t) => {
    await t.step("builds the correct command", () => {
      assertEquals(
        new ZInterStoreCommand("destination", 2, ["key1", "key2"], {
          weights: [2, 3],
        }).command,
        [
          "zinterstore",
          "destination",
          "2",
          "key1",
          "key2",
          "weights",
          "2",
          "3",
        ],
      );
    });
    await t.step("with aggregate", async (t) => {
      await t.step("sum", async (t) => {
        await t.step("builds the correct command", () => {
          assertEquals(
            new ZInterStoreCommand("destination", 1, "key", {
              aggregate: "sum",
            }).command,
            ["zinterstore", "destination", "1", "key", "aggregate", "sum"],
          );
        });
      });
      await t.step("min", async (t) => {
        await t.step("builds the correct command", () => {
          assertEquals(
            new ZInterStoreCommand("destination", 1, "key", {
              aggregate: "min",
            }).command,
            ["zinterstore", "destination", "1", "key", "aggregate", "min"],
          );
        });
      });
      await t.step("max", async (t) => {
        await t.step("builds the correct command", () => {
          assertEquals(
            new ZInterStoreCommand("destination", 1, "key", {
              aggregate: "max",
            }).command,
            ["zinterstore", "destination", "1", "key", "aggregate", "max"],
          );
        });
      });
    });
    await t.step("complex", async (t) => {
      await t.step("builds the correct command", () => {
        assertEquals(
          new ZInterStoreCommand("destination", 2, ["key1", "key2"], {
            weights: [4, 2],
            aggregate: "max",
          }).command,
          [
            "zinterstore",
            "destination",
            "2",
            "key1",
            "key2",
            "weights",
            "4",
            "2",
            "aggregate",
            "max",
          ],
        );
      });
    });
  });
});

Deno.test("without options", async (t) => {
  await t.step("returns the number of elements in the new set ", async () => {
    const destination = newKey();
    const key1 = newKey();
    const key2 = newKey();
    const score1 = 1;
    const member1 = randomID();
    const score2 = 2;
    const member2 = randomID();

    await new ZAddCommand(key1, { score: score1, member: member1 }).exec(
      client,
    );
    await new ZAddCommand(
      key2,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
    ).exec(client);

    const res = await new ZInterStoreCommand(destination, 2, [key1, key2]).exec(
      client,
    );
    assertEquals(res, 1);
  });
});

Deno.test("with weights", async (t) => {
  await t.step("single weight", async (t) => {
    await t.step("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand(key1, { score: score1, member: member1 }).exec(
        client,
      );
      await new ZAddCommand(
        key2,
        { score: score1, member: member1 },
        { score: score2, member: member2 },
      ).exec(client);

      const res = await new ZInterStoreCommand(destination, 2, [key1, key2], {
        weights: [2, 3],
      }).exec(client);
      assertEquals(res, 1);
    });
  });
  await t.step("multiple weight", async (t) => {
    await t.step("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand(key1, { score: score1, member: member1 }).exec(
        client,
      );
      await new ZAddCommand(
        key2,
        { score: score1, member: member1 },
        { score: score2, member: member2 },
      ).exec(client);

      const res = await new ZInterStoreCommand(destination, 2, [key1, key2], {
        weights: [1, 2],
      }).exec(client);
      assertEquals(res, 1);
    });
  });
});
Deno.test("aggregate", async (t) => {
  await t.step("sum", async (t) => {
    await t.step("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand(key1, { score: score1, member: member1 }).exec(
        client,
      );
      await new ZAddCommand(
        key2,
        { score: score1, member: member1 },
        { score: score2, member: member2 },
      ).exec(client);

      const res = await new ZInterStoreCommand(destination, 2, [key1, key2], {
        aggregate: "sum",
      }).exec(client);
      assertEquals(res, 1);
    });
  });
  await t.step("min", async (t) => {
    await t.step("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand(key1, { score: score1, member: member1 }).exec(
        client,
      );
      await new ZAddCommand(
        key2,
        { score: score1, member: member1 },
        { score: score2, member: member2 },
      ).exec(client);

      const res = await new ZInterStoreCommand(destination, 2, [key1, key2], {
        aggregate: "min",
      }).exec(client);
      assertEquals(res, 1);
    });
  });
  await t.step("max", async (t) => {
    await t.step("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand(key1, { score: score1, member: member1 }).exec(
        client,
      );
      await new ZAddCommand(
        key2,
        { score: score1, member: member1 },
        { score: score2, member: member2 },
      ).exec(client);

      const res = await new ZInterStoreCommand(destination, 2, [key1, key2], {
        aggregate: "max",
      }).exec(client);
      assertEquals(res, 1);
    });
  });
});
