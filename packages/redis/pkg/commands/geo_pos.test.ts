import { describe, expect, test } from "bun:test";
import { newHttpClient } from "../test-utils";
import { GeoAddCommand } from "./geo_add";
import { GeoPosCommand } from "./geo_pos";

const client = newHttpClient();

describe("GEOPOS tests", () => {
  test("keeps null for a missing member so indexes match the member list", async () => {
    const key = "Sicily";
    const members = ["Palermo", "Catania", "Marsala"];
    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: members[0] },
      { longitude: 15.087_269, latitude: 37.502_669, member: members[1] },
      { longitude: 12.4372, latitude: 37.7981, member: members[2] },
    ]).exec(client);
    const response = await new GeoPosCommand([key, [...members, "FooBar"]]).exec(client);
    expect(response.length).toEqual(4);
    expect(response[3]).toBeNull();
    expect(response.slice(0, 3).every(Boolean)).toEqual(true);
  });

  test("preserves a null in the middle of the member list", async () => {
    const key = "Sicily-middle";
    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: "Palermo" },
      { longitude: 15.087_269, latitude: 37.502_669, member: "Catania" },
    ]).exec(client);
    const response = await new GeoPosCommand([key, "Palermo", "Nowhere", "Catania"]).exec(client);
    expect(response.length).toEqual(3);
    expect(response[0]).toEqual({
      lng: expect.any(Number),
      lat: expect.any(Number),
    });
    expect(response[1]).toBeNull();
    expect(response[2]).toEqual({
      lng: expect.any(Number),
      lat: expect.any(Number),
    });
  });

  test("should return three valid positions", async () => {
    const key = "Sicily";
    const members = ["Palermo", "Catania", "Marsala"];
    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: members[0] },
      { longitude: 15.087_269, latitude: 37.502_669, member: members[1] },
      { longitude: 12.4372, latitude: 37.7981, member: members[2] },
    ]).exec(client);

    const response = await new GeoPosCommand([key, members]).exec(client);

    expect(response.every(Boolean)).toEqual(true);
  });

  test("should return a single null for a missing member", async () => {
    const key = "Sicily";
    const members = ["Palermo"];
    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: members[0] },
    ]).exec(client);
    const response = await new GeoPosCommand([key, "FooBar"]).exec(client);
    expect(response).toEqual([null]);
  });

  test("should work with object members", async () => {
    const key = "Sicily";
    const members = [{ name: "Palermo" }, { name: "Catania" }, { name: "Marsala" }];
    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: members[0] },
      { longitude: 15.087_269, latitude: 37.502_669, member: members[1] },
      { longitude: 12.4372, latitude: 37.7981, member: members[2] },
    ]).exec(client);
    const response = await new GeoPosCommand([key, [...members, "FooBar"]]).exec(client);
    expect(response.length).toEqual(4);
    expect(response[3]).toBeNull();
  });
});
