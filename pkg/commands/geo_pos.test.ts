import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { newHttpClient } from "../test-utils.ts";
import { GeoAddCommand } from "./geo_add.ts";
import { GeoPosCommand } from "./geo_pos.ts";

const client = newHttpClient();

Deno.test("should swallow non-existing member and return only the valid ones", async () => {
  const key = "Sicily";
  const members = ["Palermo", "Catania", "Marsala"];
  await new GeoAddCommand([
    key,
    { longitude: 13.361389, latitude: 38.115556, member: members[0] },
    { longitude: 15.087269, latitude: 37.502669, member: members[1] },
    { longitude: 12.4372, latitude: 37.7981, member: members[2] },
  ]).exec(client);
  const response = await new GeoPosCommand([key, [...members, "FooBar"]]).exec(
    client,
  );
  assertEquals(response.length, 3);
});

Deno.test("should return three valid positions", async () => {
  const key = "Sicily";
  const members = ["Palermo", "Catania", "Marsala"];
  await new GeoAddCommand([
    key,
    { longitude: 13.361389, latitude: 38.115556, member: members[0] },
    { longitude: 15.087269, latitude: 37.502669, member: members[1] },
    { longitude: 12.4372, latitude: 37.7981, member: members[2] },
  ]).exec(client);

  const response = await new GeoPosCommand([key, members]).exec(client);

  assertEquals(response.every(Boolean), true);
});

Deno.test("should return empty array due to null value FooBar", async () => {
  const key = "Sicily";
  const members = ["Palermo"];
  await new GeoAddCommand([
    key,
    { longitude: 13.361389, latitude: 38.115556, member: members[0] },
  ]).exec(client);
  const response = await new GeoPosCommand([key, "FooBar"]).exec(client);
  assertEquals(response, []);
});

Deno.test("should work with object members", async () => {
  const key = "Sicily";
  const members = [
    { name: "Palermo" },
    { name: "Catania" },
    { name: "Marsala" },
  ];
  await new GeoAddCommand([
    key,
    { longitude: 13.361389, latitude: 38.115556, member: members[0] },
    { longitude: 15.087269, latitude: 37.502669, member: members[1] },
    { longitude: 12.4372, latitude: 37.7981, member: members[2] },
  ]).exec(client);
  const response = await new GeoPosCommand([key, [...members, "FooBar"]]).exec(
    client,
  );
  assertEquals(response.length, 3);
});
