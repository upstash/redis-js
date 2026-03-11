import { afterAll, describe, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils.ts";

import { GeoAddCommand } from "./geo_add.ts";
import { GeoSearchCommand } from "./geo_search.ts";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("GEOSEARCH tests", () => {
  test("should return distance successfully in meters", async () => {
    const key = newKey();
    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: "Palermo" },
      { longitude: 15.087_269, latitude: 37.502_669, member: "Catania" },
    ]).exec(client);

    const res = await new GeoSearchCommand([
      key,
      { type: "FROMLONLAT", coordinate: { lon: 15, lat: 37 } },
      { type: "BYRADIUS", radius: 200, radiusType: "KM" },
      "ASC",
    ]).exec(client);

    expect(res).toEqual([{ member: "Catania" }, { member: "Palermo" }]);
  });

  test("should return members within the specified box", async () => {
    const key = newKey();

    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: "Palermo" },
      { longitude: 15.087_269, latitude: 37.502_669, member: "Catania" },
    ]).exec(client);

    const res = await new GeoSearchCommand([
      key,
      { type: "FROMLONLAT", coordinate: { lon: 14, lat: 37.5 } },
      { type: "BYBOX", rect: { width: 200, height: 200 }, rectType: "KM" },
      "ASC",
    ]).exec(client);

    expect(res).toEqual([{ member: "Palermo" }, { member: "Catania" }]);
  });

  test("should return members with coordinates, distances, and hashes", async () => {
    const key = newKey();

    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: "Palermo" },
      { longitude: 15.087_269, latitude: 37.502_669, member: "Catania" },
    ]).exec(client);

    const res = await new GeoSearchCommand([
      key,
      { type: "FROMLONLAT", coordinate: { lon: 14, lat: 37.5 } },
      { type: "BYRADIUS", radius: 200, radiusType: "KM" },
      "ASC",
      { withHash: true, withCoord: true, withDist: true },
    ]).exec(client);

    expect(res).toEqual([
      {
        member: "Palermo",
        dist: 88.526,
        hash: "3479099956230698",
        coord: {
          long: 13.361_389_338_970_184,
          lat: 38.115_556_395_496_3,
        },
      },
      {
        member: "Catania",
        dist: 95.9406,
        hash: "3479447370796909",
        coord: {
          long: 15.087_267_458_438_873,
          lat: 37.502_668_423_331_62,
        },
      },
    ]);
  });

  test("should return members with distances, and hashes", async () => {
    const key = newKey();

    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: "Palermo" },
      { longitude: 15.087_269, latitude: 37.502_669, member: "Catania" },
    ]).exec(client);

    const res = await new GeoSearchCommand([
      key,
      { type: "FROMLONLAT", coordinate: { lon: 14, lat: 37.5 } },
      { type: "BYRADIUS", radius: 200, radiusType: "KM" },
      "ASC",
      { withHash: true, withDist: true },
    ]).exec(client);

    expect(res).toEqual([
      {
        member: "Palermo",
        dist: 88.526,
        hash: "3479099956230698",
      },
      {
        member: "Catania",
        dist: 95.9406,
        hash: "3479447370796909",
      },
    ]);
  });

  test("should return members with and coordinates", async () => {
    const key = newKey();

    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: "Palermo" },
      { longitude: 15.087_269, latitude: 37.502_669, member: "Catania" },
    ]).exec(client);

    const res = await new GeoSearchCommand([
      key,
      { type: "FROMLONLAT", coordinate: { lon: 14, lat: 37.5 } },
      { type: "BYRADIUS", radius: 200, radiusType: "KM" },
      "ASC",
      { withCoord: true },
    ]).exec(client);

    expect(res).toEqual([
      {
        member: "Palermo",
        coord: { long: 13.361_389_338_970_184, lat: 38.115_556_395_496_3 },
      },
      {
        member: "Catania",
        coord: { long: 15.087_267_458_438_873, lat: 37.502_668_423_331_62 },
      },
    ]);
  });

  test("should return members with coordinates, and hashes", async () => {
    const key = newKey();

    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: "Palermo" },
      { longitude: 15.087_269, latitude: 37.502_669, member: "Catania" },
    ]).exec(client);

    const res = await new GeoSearchCommand([
      key,
      { type: "FROMLONLAT", coordinate: { lon: 14, lat: 37.5 } },
      { type: "BYRADIUS", radius: 200, radiusType: "KM" },
      "ASC",
      { withHash: true, withCoord: true },
    ]).exec(client);

    expect(res).toEqual([
      {
        member: "Palermo",
        hash: "3479099956230698",
        coord: { long: 13.361_389_338_970_184, lat: 38.115_556_395_496_3 },
      },
      {
        member: "Catania",
        hash: "3479447370796909",
        coord: { long: 15.087_267_458_438_873, lat: 37.502_668_423_331_62 },
      },
    ]);
  });

  test("should return one member, with count set", async () => {
    const key = newKey();
    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: "Palermo" },
      { longitude: 15.087_269, latitude: 37.502_669, member: "Catania" },
    ]).exec(client);

    const res = await new GeoSearchCommand([
      key,
      { type: "FROMLONLAT", coordinate: { lon: 15, lat: 37 } },
      { type: "BYRADIUS", radius: 200, radiusType: "KM" },
      "ASC",
      { count: { limit: 1 } },
    ]).exec(client);

    expect(res).toEqual([{ member: "Catania" }]);
  });
});
