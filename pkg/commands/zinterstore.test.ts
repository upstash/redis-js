import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ZInterStoreCommand } from "./zinterstore.ts";
import { ZAddCommand } from "./zadd.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("command format", () => {
  describe("without options", () => {
    it("builds the correct command", () => {
      assertEquals(new ZInterStoreCommand("destination", 1, "key").command, [
        "zinterstore",
        "destination",
        "1",
        "key",
      ]);
    });
  });
  describe("with multiple keys", () => {
    it("builds the correct command", () => {
      assertEquals(
        new ZInterStoreCommand("destination", 2, ["key1", "key2"]).command,
        ["zinterstore", "destination", "2", "key1", "key2"],
      );
    });
  });
  describe("with single weight", () => {
    it("builds the correct command", () => {
      assertEquals(
        new ZInterStoreCommand("destination", 1, "key", { weight: 4 }).command,
        ["zinterstore", "destination", "1", "key", "weights", "4"],
      );
    });
  });
  describe("with multiple weights", () => {
    it("builds the correct command", () => {
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
    describe("with aggregate", () => {
      describe("sum", () => {
        it("builds the correct command", () => {
          assertEquals(
            new ZInterStoreCommand("destination", 1, "key", {
              aggregate: "sum",
            }).command,
            ["zinterstore", "destination", "1", "key", "aggregate", "sum"],
          );
        });
      });
      describe("min", () => {
        it("builds the correct command", () => {
          assertEquals(
            new ZInterStoreCommand("destination", 1, "key", {
              aggregate: "min",
            }).command,
            ["zinterstore", "destination", "1", "key", "aggregate", "min"],
          );
        });
      });
      describe("max", () => {
        it("builds the correct command", () => {
          assertEquals(
            new ZInterStoreCommand("destination", 1, "key", {
              aggregate: "max",
            }).command,
            ["zinterstore", "destination", "1", "key", "aggregate", "max"],
          );
        });
      });
    });
    describe("complex", () => {
      it("builds the correct command", () => {
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

describe("without options", () => {
  it("returns the number of elements in the new set ", async () => {
    const destination = newKey();
    const key1 = newKey();
    const key2 = newKey();
    const score1 = 1;
    const member1 = crypto.randomUUID();
    const score2 = 2;
    const member2 = crypto.randomUUID();

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

describe("with weights", () => {
  describe("single weight", () => {
    it("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = crypto.randomUUID();
      const score2 = 2;
      const member2 = crypto.randomUUID();

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
  describe("multiple weight", () => {
    it("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = crypto.randomUUID();
      const score2 = 2;
      const member2 = crypto.randomUUID();

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
describe("aggregate", () => {
  describe("sum", () => {
    it("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = crypto.randomUUID();
      const score2 = 2;
      const member2 = crypto.randomUUID();

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
  describe("min", () => {
    it("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = crypto.randomUUID();
      const score2 = 2;
      const member2 = crypto.randomUUID();

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
  describe("max", () => {
    it("returns the number of elements in the new set ", async () => {
      const destination = newKey();
      const key1 = newKey();
      const key2 = newKey();
      const score1 = 1;
      const member1 = crypto.randomUUID();
      const score2 = 2;
      const member2 = crypto.randomUUID();

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
