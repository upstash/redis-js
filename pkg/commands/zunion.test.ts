import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";

import { ZAddCommand } from "./zadd";
import { ZUnionCommand } from "./zunion";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("command format", () => {
  test("without options", () => {
    test("builds the correct command", () => {
      expect(new ZUnionCommand([1, "key"]).command, ["zunion", 1, "key"]);
    });
  });
  test("with multiple keys", () => {
    test("builds the correct command", () => {
      expect(new ZUnionCommand([2, ["key1", "key2"]]).command, ["zunion", 2, "key1", "key2"]);
    });
  });
  test("with single weight", () => {
    test("builds the correct command", () => {
      expect(new ZUnionCommand([1, "key", { weight: 4 }]).command, [
        "zunion",
        1,
        "key",
        "weights",
        4,
      ]);
    });
  });
  test("with multiple weights", () => {
    test("builds the correct command", () => {
      expect(
        new ZUnionCommand([
          2,
          ["key1", "key2"],
          {
            weights: [2, 3],
          },
        ]).command,
        ["zunion", 2, "key1", "key2", "weights", 2, 3],
      );
    });
    test("with aggregate", () => {
      test("sum", () => {
        test("builds the correct command", () => {
          expect(
            new ZUnionCommand([
              1,
              "key",
              {
                aggregate: "sum",
              },
            ]).command,
            ["zunion", 1, "key", "aggregate", "sum"],
          );
        });
      });
      test("min", () => {
        test("builds the correct command", () => {
          expect(
            new ZUnionCommand([
              1,
              "key",
              {
                aggregate: "min",
              },
            ]).command,
            ["zunion", 1, "key", "aggregate", "min"],
          );
        });
      });
      test("max", () => {
        test("builds the correct command", () => {
          expect(
            new ZUnionCommand([
              1,
              "key",
              {
                aggregate: "max",
              },
            ]).command,
            ["zunion", 1, "key", "aggregate", "max"],
          );
        });
      });
    });
    test("complex", () => {
      test("builds the correct command", () => {
        expect(
          new ZUnionCommand([
            2,
            ["key1", "key2"],
            {
              weights: [4, 2],
              aggregate: "max",
            },
          ]).command,
          ["zunion", 2, "key1", "key2", "weights", 4, 2, "aggregate", "max"],
        );
      });
    });
  });
});

test("without options", () => {
  test("returns the union", async () => {
    const key1 = newKey();
    const key2 = newKey();
    const score1 = 1;
    const member1 = randomID();
    const score2 = 2;
    const member2 = randomID();

    await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(client);
    await new ZAddCommand([key2, { score: score2, member: member2 }]).exec(client);

    const res = await new ZUnionCommand([2, [key1, key2]]).exec(client);

    expect(res.length, 2);
    expect(res?.sort(), [member1, member2].sort());
  });
});

test("with weights", () => {
  test("returns the set", async () => {
    const key1 = newKey();
    const key2 = newKey();
    const score1 = 1;
    const member1 = randomID();
    const score2 = 2;
    const member2 = randomID();

    await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(client);

    await new ZAddCommand([key2, { score: score2, member: member2 }]).exec(client);

    const res = await new ZUnionCommand([
      2,
      [key1, key2],
      {
        weights: [2, 3],
      },
    ]).exec(client);

    expect(res.length, 2);
  });
});

test("aggregate", () => {
  test("sum", () => {
    test("returns the set", async () => {
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(client);
      await new ZAddCommand([key2, { score: score2, member: member2 }]).exec(client);

      const res = await new ZUnionCommand([
        2,
        [key1, key2],
        {
          aggregate: "sum",
        },
      ]).exec(client);

      expect(Array.isArray(res), true);
      expect(res.length, 2);
    });
  });
  test("min", () => {
    test("returns the set ", async () => {
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(client);
      await new ZAddCommand([key2, { score: score2, member: member2 }]).exec(client);

      const res = await new ZUnionCommand([
        2,
        [key1, key2],
        {
          aggregate: "min",
        },
      ]).exec(client);
      expect(res.length, 2);
    });
  });
  test("max", () => {
    test("returns the set ", async () => {
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(client);
      await new ZAddCommand([key2, { score: score2, member: member2 }]).exec(client);

      const res = await new ZUnionCommand([
        2,
        [key1, key2],
        {
          aggregate: "max",
        },
      ]).exec(client);
      expect(res.length, 2);
    });
  });
});

test("withscores", () => {
  test("returns the set", async () => {
    const key1 = newKey();
    const score1 = 1;
    const member1 = randomID();

    const key2 = newKey();
    const member2 = randomID();
    const score2 = 5;

    await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(client);

    await new ZAddCommand([key2, { score: score2, member: member2 }]).exec(client);

    const res = await new ZUnionCommand([
      2,
      [key1, key2],
      {
        withScores: true,
      },
    ]).exec(client);

    expect(res.length, 4);
    expect(res[0], member1);
    expect(res[1], score1);
  });
});
