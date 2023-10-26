import { describe, expect, test } from "bun:test";
import { newHttpClient } from "../test-utils.ts";

import { GeoAddCommand } from "./geo_add.ts";
import { GeoHashCommand } from "./geo_hash.ts";

const client = newHttpClient();

describe("GEOHASH tests", () => {
  test("should accept two member array and return valid hash", async () => {
    const key = "Sicily";
    const members = ["Palermo", "Catania"];
    await new GeoAddCommand([
      key,
      { longitude: 13.361389, latitude: 38.115556, member: members[0] },
      { longitude: 15.087269, latitude: 37.502669, member: members[1] },
    ]).exec(client);

    const response = await new GeoHashCommand([key, members]).exec(client);
    expect(response.length).toEqual(2);
  });

  test("should accept three different string members and return valid hash", async () => {
    const key = "Sicily";
    const members = ["Palermo", "Catania", "Marsala"];
    await new GeoAddCommand([
      key,
      { longitude: 13.361389, latitude: 38.115556, member: members[0] },
      { longitude: 15.087269, latitude: 37.502669, member: members[1] },
      { longitude: 12.4372, latitude: 37.7981, member: members[2] },
    ]).exec(client);

    const response = await new GeoHashCommand([key, "Palermo", "Catania", "Marsala"]).exec(client);
    expect(response.length).toEqual(3);
  });

  test("should accept two objects as members", async () => {
    const key = "Sicily";
    const members = [{ name: "Palermo" }, { name: "Catania" }];
    await new GeoAddCommand([
      key,
      { longitude: 13.361389, latitude: 38.115556, member: members[0] },
      { longitude: 15.087269, latitude: 37.502669, member: members[1] },
    ]).exec(client);

    const response = await new GeoHashCommand([key, members]).exec(client);
    expect(response.length).toBe(2);
  });
});
