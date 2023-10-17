import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { GeoAddCommand, GeoMember } from "./geo_add.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

interface Coordinate {
  latitude: number;
  longitude: number;
}

function generateRandomPoint(radius = 100): Coordinate {
  const center = { lat: 14.23, lng: 23.12 };

  const x0 = center.lng;
  const y0 = center.lat;
  // Convert Radius from meters to degrees.
  const rd = radius / 111300;

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

Deno.test("without options", async (t) => {
  await t.step("adds the geo member", async () => {
    const key = newKey();
    const member = randomID();

    const res = await new GeoAddCommand([
      key,
      { ...generateRandomPoint(), member },
    ]).exec(client);
    assertEquals(res, 1);
  });

  await t.step("adds multiple members", async () => {
    const key = newKey();

    const res = await new GeoAddCommand([
      key,
      { ...generateRandomPoint(), member: randomID() },
      { ...generateRandomPoint(), member: randomID() },
      { ...generateRandomPoint(), member: randomID() },
      { ...generateRandomPoint(), member: randomID() },
    ]).exec(client);

    assertEquals(res, 4);
  });

  await t.step("adds the geo member with member as object", async () => {
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

    assertEquals(res, 7);
  });
});

Deno.test("xx", async (t) => {
  await t.step("when the member exists", async (t) => {
    await t.step("updates the member", async () => {
      const key = newKey();
      const member = getTestMember();

      // Create member.
      await new GeoAddCommand<Record<string, number>>([key, member]).exec(
        client,
      );

      const updatedMember = { ...generateRandomPoint(), member: member.member };

      const response = await new GeoAddCommand<Record<string, number>>([
        key,
        { xx: true },
        updatedMember,
      ]).exec(client);

      assertEquals(response, 0);
    });
  });
  await t.step("when the member does not exist", async (t) => {
    await t.step("does nothing", async () => {
      const key = newKey();
      const member = getTestMember();

      // Create member.
      await new GeoAddCommand<Record<string, number>>([
        key,
        { xx: true },
        member,
      ]).exec(client);

      const { result } = await client.request({
        body: ["geopos", key, JSON.stringify(member.member)],
      });

      assertEquals(result, [null]);
    });
  });
});

Deno.test("nx", async (t) => {
  await t.step("when the member exists", async (t) => {
    await t.step("does not update the member", async () => {
      const key = newKey();
      const member = getTestMember();

      // Create member.
      await new GeoAddCommand<Record<string, number>>([key, member]).exec(
        client,
      );

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

      assertEquals(response, 0);

      // Get member position again. And assert it didn't change
      const { result: updatedResult } = await client.request({
        body: ["geopos", key, JSON.stringify(member.member)],
      });

      assertEquals(result, updatedResult);
    });
  });

  await t.step("when the member does not exist", async (t) => {
    await t.step("adds new member", async () => {
      const key = newKey();
      const member = getTestMember();

      // Create member.
      const response = await new GeoAddCommand<Record<string, number>>([
        key,
        { nx: true },
        member,
      ]).exec(client);

      assertEquals(response, 1);
    });
  });
});

Deno.test("ch", async (t) => {
  await t.step("returns the number of changed elements", async (t) => {
    const key = newKey();
    const member = getTestMember();
    const member2 = getTestMember();
    const member3 = getTestMember();

    // Create member.
    await new GeoAddCommand<Record<string, number>>([
      key,
      member,
      member2,
      member3,
    ]).exec(client);

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

    assertEquals(response, 2);
  });
});
