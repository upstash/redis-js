import { afterAll, describe, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils.ts";

import { GeoAddCommand } from "./geo_add.ts";
import { GeoSearchStoreCommand } from "./geo_search_store.ts";
import { ZRangeCommand } from "./zrange.ts";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("GEOSSEARCHSTORE tests", () => {
  test("should return members within the radius and store them in sorted set", async () => {
    const key = newKey();
    const destination = newKey();

    await new GeoAddCommand([
      key,
      { longitude: -73.9857, latitude: 40.7488, member: "Empire State Building" },
      { longitude: -74.0445, latitude: 40.6892, member: "Statue of Liberty" },
      { longitude: -73.9632, latitude: 40.7789, member: "Central Park" },
      { longitude: -73.873, latitude: 40.7769, member: "LaGuardia Airport" },
      { longitude: -74.177, latitude: 40.6413, member: "JFK Airport" },
      { longitude: -73.9772, latitude: 40.7527, member: "Grand Central Terminal" },
    ]).exec(client);

    const res = await new GeoSearchStoreCommand([
      destination,
      key,
      { type: "FROMMEMBER", member: "Empire State Building" },
      { type: "BYRADIUS", radius: 5, radiusType: "KM" },
      "ASC",
    ]).exec(client);
    const zrangeRes = await new ZRangeCommand([destination, 0, -1, { withScores: true }]).exec(
      client,
    );
    expect(zrangeRes).toEqual([
      "Empire State Building",
      1791875672666387,
      "Grand Central Terminal",
      1791875708058440,
      "Central Park",
      1791875790048608,
    ]);
    expect(res).toEqual(zrangeRes.length / 2);
  });

  test("should store geosearch in sorted set with distances", async () => {
    const key = newKey();
    const destination = newKey();

    await new GeoAddCommand([
      key,
      { longitude: -73.9857, latitude: 40.7488, member: "Empire State Building" },
      { longitude: -74.0445, latitude: 40.6892, member: "Statue of Liberty" },
      { longitude: -73.9632, latitude: 40.7789, member: "Central Park" },
      { longitude: -73.873, latitude: 40.7769, member: "LaGuardia Airport" },
      { longitude: -74.177, latitude: 40.6413, member: "JFK Airport" },
      { longitude: -73.9772, latitude: 40.7527, member: "Grand Central Terminal" },
    ]).exec(client);

    const res = await new GeoSearchStoreCommand([
      destination,
      key,
      { type: "FROMMEMBER", member: "Empire State Building" },
      { type: "BYRADIUS", radius: 5, radiusType: "KM" },
      "ASC",
      { storeDist: true },
    ]).exec(client);
    const zrangeRes = await new ZRangeCommand([destination, 0, -1, { withScores: true }]).exec(
      client,
    );
    expect(zrangeRes).toEqual([
      "Empire State Building",
      0,
      "Grand Central Terminal",
      "0.83757447438393129",
      "Central Park",
      "3.8473905221815641",
    ]);
    expect(res).toEqual(zrangeRes.length / 2);
  });

  test("should return object members within the radius and store them in sorted set with distance and members", async () => {
    const key = newKey();
    const destination = newKey();

    await new GeoAddCommand<{ name: string }>([
      key,
      { longitude: -73.9857, latitude: 40.7488, member: { name: "Empire State Building" } },
      { longitude: -74.0445, latitude: 40.6892, member: { name: "Statue of Liberty" } },
      { longitude: -73.9632, latitude: 40.7789, member: { name: "Central Park" } },
      { longitude: -73.873, latitude: 40.7769, member: { name: "LaGuardia Airport" } },
      { longitude: -74.177, latitude: 40.6413, member: { name: "JFK Airport" } },
      { longitude: -73.9772, latitude: 40.7527, member: { name: "Grand Central Terminal" } },
    ]).exec(client);

    const res = await new GeoSearchStoreCommand([
      destination,
      key,
      { type: "FROMMEMBER", member: { name: "Empire State Building" } },
      { type: "BYRADIUS", radius: 5, radiusType: "KM" },
      "DESC",
      { storeDist: true },
    ]).exec(client);
    const zrangeRes = await new ZRangeCommand([destination, 0, -1, { withScores: true }]).exec(
      client,
    );
    expect(zrangeRes).toEqual([
      { name: "Empire State Building" },
      0,
      { name: "Grand Central Terminal" },
      "0.83757447438393129",
      { name: "Central Park" },
      "3.8473905221815641",
    ]);
    expect(res).toEqual(zrangeRes.length / 2);
  });
});
