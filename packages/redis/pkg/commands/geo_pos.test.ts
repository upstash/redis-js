import { describe, expect, test } from "bun:test";
import { newHttpClient } from "../test-utils";
import { GeoAddCommand } from "./geo_add";
import { GeoPosCommand } from "./geo_pos";

const client = newHttpClient();

describe("GEOPOS tests", () => {
  test("should swallow non-existing member and return only the valid ones", async () => {
    const key = "Sicily";
    const members = ["Palermo", "Catania", "Marsala"];
    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: members[0] },
      { longitude: 15.087_269, latitude: 37.502_669, member: members[1] },
      { longitude: 12.4372, latitude: 37.7981, member: members[2] },
    ]).exec(client);
    const response = await new GeoPosCommand([key, [...members, "FooBar"]]).exec(client);
    expect(response.length).toEqual(3);
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

  test("should return empty array due to null value FooBar", async () => {
    const key = "Sicily";
    const members = ["Palermo"];
    await new GeoAddCommand([
      key,
      { longitude: 13.361_389, latitude: 38.115_556, member: members[0] },
    ]).exec(client);
    const response = await new GeoPosCommand([key, "FooBar"]).exec(client);
    expect(response).toEqual([]);
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
    expect(response.length).toEqual(3);
  });
});
