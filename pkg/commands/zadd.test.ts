import { keygen, newHttpClient } from "../test-utils";
import { randomInt, randomUUID } from "crypto";
import { afterAll, describe, expect, it } from "@jest/globals";
import { ZAddCommand } from "./zadd";
import { ZScoreCommand } from "./zscore";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
  "command format",
  () => {
    describe(
      "without options",
      () => {
        it(
          "build the correct command",
          () => {
            expect(
              new ZAddCommand("key", { score: 0, member: "member" }).command,
            ).toEqual(["zadd", "key", "0", "member"]);
          },
        );
      },
    );
    describe(
      "with nx",
      () => {
        it(
          "build the correct command",
          () => {
            expect(
              new ZAddCommand(
                "key",
                { nx: true },
                { score: 0, member: "member" },
              ).command,
            ).toEqual(["zadd", "key", "nx", "0", "member"]);
          },
        );
      },
    );
    describe(
      "with xx",
      () => {
        it(
          "build the correct command",
          () => {
            expect(
              new ZAddCommand(
                "key",
                { xx: true },
                { score: 0, member: "member" },
              ).command,
            ).toEqual(["zadd", "key", "xx", "0", "member"]);
          },
        );
      },
    );
    describe(
      "with ch",
      () => {
        it(
          "build the correct command",
          () => {
            expect(
              new ZAddCommand(
                "key",
                { ch: true },
                { score: 0, member: "member" },
              ).command,
            ).toEqual(["zadd", "key", "ch", "0", "member"]);
          },
        );
      },
    );
    describe(
      "with incr",
      () => {
        it(
          "build the correct command",
          () => {
            expect(
              new ZAddCommand(
                "key",
                { incr: true },
                { score: 0, member: "member" },
              ).command,
            ).toEqual(["zadd", "key", "incr", "0", "member"]);
          },
        );
      },
    );
    describe(
      "with nx and ch",
      () => {
        it(
          "build the correct command",
          () => {
            expect(
              new ZAddCommand(
                "key",
                { nx: true, ch: true },
                { score: 0, member: "member" },
              ).command,
            ).toEqual(["zadd", "key", "nx", "ch", "0", "member"]);
          },
        );
      },
    );
    describe(
      "with nx,ch and incr",
      () => {
        it(
          "build the correct command",
          () => {
            expect(
              new ZAddCommand(
                "key",
                { nx: true, ch: true, incr: true },
                { score: 0, member: "member" },
              ).command,
            ).toEqual(["zadd", "key", "nx", "ch", "incr", "0", "member"]);
          },
        );
      },
    );
    describe(
      "with nx and multiple members",
      () => {
        it(
          "build the correct command",
          () => {
            expect(
              new ZAddCommand(
                "key",
                { nx: true },
                { score: 0, member: "member" },
                { score: 1, member: "member1" },
              ).command,
            ).toEqual(["zadd", "key", "nx", "0", "member", "1", "member1"]);
          },
        );
      },
    );
  },
);

describe(
  "without options",
  () => {
    it(
      "adds the member",
      async () => {
        const key = newKey();
        const member = randomUUID();
        const score = randomInt(10);
        const res = await new ZAddCommand(key, { score, member }).exec(client);
        expect(res).toBe(1);
      },
    );
  },
);

describe(
  "xx",
  () => {
    describe(
      "when the element exists",
      () => {
        it(
          "updates the element",
          async () => {
            const key = newKey();
            const member = randomUUID();
            const score = randomInt(10);
            await new ZAddCommand(key, { score, member }).exec(client);
            const newScore = score + 1;
            const res = await new ZAddCommand(
              key,
              { xx: true },
              { score: newScore, member },
            ).exec(client);
            expect(res).toBe(0);

            const res2 = await new ZScoreCommand(key, member).exec(client);
            expect(res2).toBe(newScore);
          },
        );
      },
    );
    describe(
      "when the element does not exist",
      () => {
        it(
          "does nothing",
          async () => {
            const key = newKey();
            const member = randomUUID();
            const score = randomInt(10);
            await new ZAddCommand(key, { score, member }).exec(client);
            const newScore = score + 1;
            const res = await new ZAddCommand(
              key,
              { xx: true },
              { score: newScore, member },
            ).exec(client);
            expect(res).toBe(0);
          },
        );
      },
    );
  },
);

describe(
  "nx",
  () => {
    describe(
      "when the element exists",
      () => {
        it(
          "does nothing",
          async () => {
            const key = newKey();
            const member = randomUUID();
            const score = randomInt(10);
            await new ZAddCommand(key, { score, member }).exec(client);
            const newScore = score + 1;
            const res = await new ZAddCommand(
              key,
              { nx: true },
              { score: newScore, member },
            ).exec(client);
            expect(res).toBe(0);

            const res2 = await new ZScoreCommand(key, member).exec(client);
            expect(res2).toBe(score);
          },
        );
      },
    );
    describe(
      "when the element does not exist",
      () => {
        it(
          "creates element",
          async () => {
            const key = newKey();
            const member = randomUUID();
            const score = randomInt(10);
            const res = await new ZAddCommand(
              key,
              { nx: true },
              { score, member },
            ).exec(client);
            expect(res).toBe(1);
          },
        );
      },
    );
  },
);

describe(
  "ch",
  () => {
    it(
      "returns the number of changed elements",
      async () => {
        const key = newKey();
        const member = randomUUID();
        const score = randomInt(10);
        await new ZAddCommand(key, { score, member }).exec(client);
        const newScore = score + 1;
        const res = await new ZAddCommand(
          key,
          { ch: true },
          { score: newScore, member },
        ).exec(client);
        expect(res).toBe(1);
      },
    );
  },
);

describe(
  "incr",
  () => {
    it(
      "returns the number of changed elements",
      async () => {
        const key = newKey();
        const member = randomUUID();
        const score = randomInt(10);
        await new ZAddCommand(key, { score, member }).exec(client);
        const newScore = score + 1;
        const res = await new ZAddCommand(
          key,
          { ch: true },
          { score: newScore, member },
        ).exec(client);
        expect(res).toBe(1);
      },
    );
  },
);
