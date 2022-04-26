import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { afterAll, describe, expect, it } from "@jest/globals";
import { ZAddCommand } from "./zadd";
import { ZRangeCommand } from "./zrange";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
  "without options",
  () => {
    it(
      "returns the set",
      async () => {
        const key = newKey();
        const score1 = 2;
        const member1 = randomUUID();

        const score2 = 5;
        const member2 = randomUUID();

        await new ZAddCommand(
          key,
          { score: score1, member: member1 },
          { score: score2, member: member2 },
        ).exec(client);

        const res = await new ZRangeCommand(key, 1, 3).exec(client);
        expect(res).toHaveLength(1);
        expect(res![0]).toEqual(member2);
      },
    );
  },
);

describe(
  "withscores",
  () => {
    it(
      "returns the set",
      async () => {
        const key = newKey();
        const score1 = 2;
        const member1 = randomUUID();

        const score2 = 5;
        const member2 = randomUUID();

        await new ZAddCommand(
          key,
          { score: score1, member: member1 },
          { score: score2, member: member2 },
        ).exec(client);

        const res = await new ZRangeCommand(key, 1, 3, { withScores: true })
          .exec(
            client,
          );
        expect(res).toHaveLength(2);
        expect(res![0]).toEqual(member2);
        expect(res![1]).toEqual(score2);
      },
    );
  },
);

describe(
  "byscore",
  () => {
    it(
      "returns the set",
      async () => {
        const key = newKey();
        const score1 = 1;
        const member1 = randomUUID();

        const score2 = 2;
        const member2 = randomUUID();

        const score3 = 3;
        const member3 = randomUUID();

        await new ZAddCommand(
          key,
          { score: score1, member: member1 },
          { score: score2, member: member2 },
          { score: score3, member: member3 },
        ).exec(client);

        const res = await new ZRangeCommand(
          key,
          score1,
          score2,
          { byScore: true },
        ).exec(client);

        expect(res).toHaveLength(2);
        expect(res![0]).toEqual(member1);
        expect(res![1]).toEqual(member2);

        const res2 = await new ZRangeCommand(
          key,
          score1,
          score3,
          { byScore: true },
        ).exec(client);
        expect(res2).toHaveLength(3);
        expect(res2![0]).toEqual(member1);
        expect(res2![1]).toEqual(member2);
        expect(res2![2]).toEqual(member3);

        const res3 = await new ZRangeCommand(
          key,
          "-inf",
          "+inf",
          { byScore: true },
        ).exec(client);
        expect(res3).toEqual(res2);
      },
    );
  },
);

describe(
  "bylex",
  () => {
    it(
      "returns the set",
      async () => {
        const key = newKey();

        await new ZAddCommand(
          key,
          { score: 0, member: "a" },
          { score: 0, member: "b" },
          { score: 0, member: "c" },
        ).exec(client);

        // everything in between a and c, excluding "a" and including "c"
        const res = await new ZRangeCommand(key, "(a", "[c", { byLex: true })
          .exec(
            client,
          );
        expect(res).toHaveLength(2);
        expect(res![0]).toEqual("b");
        expect(res![1]).toEqual("c");

        //everything after "a", excluding a
        const res2 = await new ZRangeCommand(key, "(a", "+", { byLex: true })
          .exec(
            client,
          );
        expect(res2).toEqual(res);

        // everything in between a and "bb", including "a" and excluding "bb"
        const res3 = await new ZRangeCommand(key, "[a", "(bb", { byLex: true })
          .exec(
            client,
          );
        expect(res3).toHaveLength(2);
        expect(res3![0]).toEqual("a");
        expect(res3![1]).toEqual("b");
      },
    );
  },
);
