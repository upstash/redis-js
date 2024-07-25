import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";

import type { GeoMember } from "./geo_add";
import { GeoAddCommand } from "./geo_add";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

type Coordinate = {
  latitude: number;
  longitude: number;
};

function generateRandomPoint(radius = 100): Coordinate {
  const center = { lat: 14.23, lng: 23.12 };

  const x0 = center.lng;
  const y0 = center.lat;
  // Convert Radius from meters to degrees.
  const rd = radius / 111_300;

  const u = Math.random();
  const v = Math.random();

  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  const xp = x / Math.cos(y0);

  // Resulting point.
  return { latitude: y + y0, longitude: xp + x0 };
}

function getTestMember(): GeoMember<Record<string, number>> {
  const member = randomID();

  return {
    ...generateRandomPoint(),
    member: { [member]: Math.random() * 1000 },
  };
}

describe("without options", () => {
  test("adds the geo member", async () => {
    const key = newKey();
    const member = randomID();

    const res = await new GeoAddCommand([key, { ...generateRandomPoint(), member }]).exec(client);
    expect(res).toEqual(1);
  });

  test("adds multiple members", async () => {
    const key = newKey();

    const res = await new GeoAddCommand([
      key,
      { ...generateRandomPoint(), member: randomID() },
      { ...generateRandomPoint(), member: randomID() },
      { ...generateRandomPoint(), member: randomID() },
      { ...generateRandomPoint(), member: randomID() },
    ]).exec(client);

    expect(res).toEqual(4);
  });

  test("adds the geo member with member as object", async () => {
    const key = newKey();

    const res = await new GeoAddCommand<Record<string, number>>([
      key,
      getTestMember(),
      getTestMember(),
      getTestMember(),
      getTestMember(),
      getTestMember(),
      getTestMember(),
      getTestMember(),
    ]).exec(client);

    expect(res).toEqual(7);
  });
});

describe("xx", () => {
  describe("when the member exists", () => {
    test("updates the member", async () => {
      const key = newKey();
      const member = getTestMember();

      // Create member.
      await new GeoAddCommand<Record<string, number>>([key, member]).exec(client);

      const updatedMember = { ...generateRandomPoint(), member: member.member };

      const response = await new GeoAddCommand<Record<string, number>>([
        key,
        { xx: true },
        updatedMember,
      ]).exec(client);

      expect(response).toEqual(0);
    });
  });
  describe("when the member does not exist", () => {
    test("does nothing", async () => {
      const key = newKey();
      const member = getTestMember();

      // Create member.
      await new GeoAddCommand<Record<string, number>>([key, { xx: true }, member]).exec(client);

      const { result } = await client.request({
        body: ["geopos", key, JSON.stringify(member.member)],
      });

      expect(result).toEqual([null]);
    });
  });
});

describe("nx", () => {
  describe("when the member exists", () => {
    test("does not update the member", async () => {
      const key = newKey();
      const member = getTestMember();

      // Create member.
      await new GeoAddCommand<Record<string, number>>([key, member]).exec(client);

      // Get member position
      const { result } = await client.request({
        body: ["geopos", key, JSON.stringify(member.member)],
      });

      const updatedMember = { ...generateRandomPoint(), member: member.member };

      // Update member with nx command.
      const response = await new GeoAddCommand<Record<string, number>>([
        key,
        { nx: true },
        updatedMember,
      ]).exec(client);

      expect(response).toEqual(0);

      // Get member position again. And assert it didn't change
      const { result: updatedResult } = await client.request({
        body: ["geopos", key, JSON.stringify(member.member)],
      });

      expect(result).toEqual(updatedResult);
    });
  });

  describe("when the member does not exist", () => {
    test("adds new member", async () => {
      const key = newKey();
      const member = getTestMember();

      // Create member.
      const response = await new GeoAddCommand<Record<string, number>>([
        key,
        { nx: true },
        member,
      ]).exec(client);

      expect(response).toEqual(1);
    });
  });
});

describe("ch", () => {
  test("returns the number of changed elements", async () => {
    const key = newKey();
    const member = getTestMember();
    const member2 = getTestMember();
    const member3 = getTestMember();

    // Create member.
    await new GeoAddCommand<Record<string, number>>([key, member, member2, member3]).exec(client);

    const updatedMember2 = { ...member2, ...generateRandomPoint() };
    const updatedMember3 = { ...member3, ...generateRandomPoint() };

    // Create members again, but this time change members 2 and 3
    const response = await new GeoAddCommand<Record<string, number>>([
      key,
      { ch: true },
      member,
      updatedMember2,
      updatedMember3,
    ]).exec(client);

    expect(response).toEqual(2);
  });
});
