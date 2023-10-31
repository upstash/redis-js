import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { ZAddCommand } from "./zadd";
import { ZInterStoreCommand } from "./zinterstore";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("command format", () => {
  describe("without options", () => {
    test("builds the correct command", () => {
      expect(new ZInterStoreCommand(["destination", 1, "key"]).command).toEqual([
        "zinterstore",
        "destination",
        1,
        "key",
      ]);
    });
  });
  describe("with multiple keys", () => {
    test("builds the correct command", () => {
      expect(new ZInterStoreCommand(["destination", 2, ["key1", "key2"]]).command).toEqual([
        "zinterstore",
        "destination",
        2,
        "key1",
        "key2",
      ]);
    });
  });
  describe("with single weight", () => {
    test("builds the correct command", () => {
      expect(new ZInterStoreCommand(["destination", 1, "key", { weight: 4 }]).command).toEqual([
        "zinterstore",
        "destination",
        1,
        "key",
        "weights",
        4,
      ]);
    });
  });
  describe("with multiple weights", () => {
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
      ).toEqual(["zinterstore", "destination", 2, "key1", "key2", "weights", 2, 3]);
    });
    describe("with aggregate", () => {
      describe("sum", () => {
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
          ).toEqual(["zinterstore", "destination", 1, "key", "aggregate", "sum"]);
        });
      });
      describe("min", () => {
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
          ).toEqual(["zinterstore", "destination", 1, "key", "aggregate", "min"]);
        });
      });
      describe("max", () => {
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
          ).toEqual(["zinterstore", "destination", 1, "key", "aggregate", "max"]);
        });
      });
    });
    describe("complex", () => {
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
        ).toEqual([
          "zinterstore",
          "destination",
          2,
          "key1",
          "key2",
          "weights",
          4,
          2,
          "aggregate",
          "max",
        ]);
      });
    });
  });
});

describe("without options", () => {
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

describe("with weights", () => {
  describe("single weight", () => {
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
  describe("multiple weight", () => {
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
describe("aggregate", () => {
  describe("sum", () => {
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
  describe("min", () => {
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
  describe("max", () => {
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
