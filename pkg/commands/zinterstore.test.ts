import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { ZAddCommand } from "./zadd";
import { ZInterStoreCommand } from "./zinterstore";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("command format", () => {
  test("without options", () => {
    test("builds the correct command", () => {
      expect(new ZInterStoreCommand(["destination", 1, "key"]).command, [
        "zinterstore",
        "destination",
        1,
        "key",
      ]);
    });
  });
  test("with multiple keys", () => {
    test("builds the correct command", () => {
      expect(new ZInterStoreCommand(["destination", 2, ["key1", "key2"]]).command, [
        "zinterstore",
        "destination",
        2,
        "key1",
        "key2",
      ]);
    });
  });
  test("with single weight", () => {
    test("builds the correct command", () => {
      expect(new ZInterStoreCommand(["destination", 1, "key", { weight: 4 }]).command, [
        "zinterstore",
        "destination",
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
        new ZInterStoreCommand([
          "destination",
          2,
          ["key1", "key2"],
          {
            weights: [2, 3],
          },
        ]).command,
        ["zinterstore", "destination", 2, "key1", "key2", "weights", 2, 3],
      );
    });
    test("with aggregate", () => {
      test("sum", () => {
        test("builds the correct command", () => {
          expect(
            new ZInterStoreCommand([
              "destination",
              1,
              "key",
              {
                aggregate: "sum",
              },
            ]).command,
            ["zinterstore", "destination", 1, "key", "aggregate", "sum"],
          );
        });
      });
      test("min", () => {
        test("builds the correct command", () => {
          expect(
            new ZInterStoreCommand([
              "destination",
              1,
              "key",
              {
                aggregate: "min",
              },
            ]).command,
            ["zinterstore", "destination", 1, "key", "aggregate", "min"],
          );
        });
      });
      test("max", () => {
        test("builds the correct command", () => {
          expect(
            new ZInterStoreCommand([
              "destination",
              1,
              "key",
              {
                aggregate: "max",
              },
            ]).command,
            ["zinterstore", "destination", 1, "key", "aggregate", "max"],
          );
        });
      });
    });
    test("complex", () => {
      test("builds the correct command", () => {
        expect(
          new ZInterStoreCommand([
            "destination",
            2,
            ["key1", "key2"],
            {
              weights: [4, 2],
              aggregate: "max",
            },
          ]).command,
          ["zinterstore", "destination", 2, "key1", "key2", "weights", 4, 2, "aggregate", "max"],
        );
      });
    });
  });
});

test("without options", () => {
  test("returns the number of elements in the new set ", async () => {
    const destination = newKey();
    const key1 = newKey();
    const key2 = newKey();
    const score1 = 1;
    const member1 = randomID();
    const score2 = 2;
    const member2 = randomID();

    await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(client);
    await new ZAddCommand([
      key2,
      { score: score1, member: member1 },
      { score: score2, member: member2 },
    ]).exec(client);

    const res = await new ZInterStoreCommand([destination, 2, [key1, key2]]).exec(client);
    expect(res).toEqual(1);
  });
});

test("with weights", () => {
  test("single weight", () => {
    test("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(client);
      await new ZAddCommand([
        key2,
        { score: score1, member: member1 },
        { score: score2, member: member2 },
      ]).exec(client);

      const res = await new ZInterStoreCommand([
        destination,
        2,
        [key1, key2],
        {
          weights: [2, 3],
        },
      ]).exec(client);
      expect(res).toEqual(1);
    });
  });
  test("multiple weight", () => {
    test("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(client);
      await new ZAddCommand([
        key2,
        { score: score1, member: member1 },
        { score: score2, member: member2 },
      ]).exec(client);

      const res = await new ZInterStoreCommand([
        destination,
        2,
        [key1, key2],
        {
          weights: [1, 2],
        },
      ]).exec(client);
      expect(res).toEqual(1);
    });
  });
});
test("aggregate", () => {
  test("sum", () => {
    test("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(client);
      await new ZAddCommand([
        key2,
        { score: score1, member: member1 },
        { score: score2, member: member2 },
      ]).exec(client);

      const res = await new ZInterStoreCommand([
        destination,
        2,
        [key1, key2],
        {
          aggregate: "sum",
        },
      ]).exec(client);
      expect(res).toEqual(1);
    });
  });
  test("min", () => {
    test("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(client);
      await new ZAddCommand([
        key2,
        { score: score1, member: member1 },
        { score: score2, member: member2 },
      ]).exec(client);

      const res = await new ZInterStoreCommand([
        destination,
        2,
        [key1, key2],
        {
          aggregate: "min",
        },
      ]).exec(client);
      expect(res).toEqual(1);
    });
  });
  test("max", () => {
    test("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = randomID();
      const score2 = 2;
      const member2 = randomID();

      await new ZAddCommand([key1, { score: score1, member: member1 }]).exec(client);
      await new ZAddCommand([
        key2,
        { score: score1, member: member1 },
        { score: score2, member: member2 },
      ]).exec(client);

      const res = await new ZInterStoreCommand([
        destination,
        2,
        [key1, key2],
        {
          aggregate: "max",
        },
      ]).exec(client);
      expect(res).toEqual(1);
    });
  });
});
