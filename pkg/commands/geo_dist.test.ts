import { newHttpClient } from "../test-utils.ts";

import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { GeoAddCommand } from "./geo_add.ts";
import { GeoDistCommand } from "./geo_dist.ts";

const client = newHttpClient();

Deno.test("should return distance successfully in meters", async () => {
  await new GeoAddCommand([
    "Sicily",
    { longitude: 13.361389, latitude: 38.115556, member: "Palermo" },
    { longitude: 15.087269, latitude: 37.502669, member: "Catania" },
  ]).exec(client);

  const res = await new GeoDistCommand(["Sicily", "Palermo", "Catania"]).exec(
    client,
  );

  assertEquals(res, 166274.1516);
});

Deno.test("should return distance successfully in kilometers", async () => {
  await new GeoAddCommand([
    "Sicily",
    { longitude: 13.361389, latitude: 38.115556, member: "Palermo" },
    { longitude: 15.087269, latitude: 37.502669, member: "Catania" },
  ]).exec(client);

  const res = await new GeoDistCommand(["Sicily", "Palermo", "Catania", "KM"])
    .exec(client);

  assertEquals(res, 166.2742);
});

Deno.test("should return distance successfully in miles", async () => {
  await new GeoAddCommand([
    "Sicily",
    { longitude: 13.361389, latitude: 38.115556, member: "Palermo" },
    { longitude: 15.087269, latitude: 37.502669, member: "Catania" },
  ]).exec(client);

  const res = await new GeoDistCommand(["Sicily", "Palermo", "Catania", "MI"])
    .exec(client);

  assertEquals(res, 103.3182);
});

Deno.test("should return distance successfully in feet", async () => {
  await new GeoAddCommand([
    "Sicily",
    { longitude: 13.361389, latitude: 38.115556, member: "Palermo" },
    { longitude: 15.087269, latitude: 37.502669, member: "Catania" },
  ]).exec(client);

  const res = await new GeoDistCommand(["Sicily", "Palermo", "Catania", "FT"])
    .exec(client);

  assertEquals(res?.toString(), "545518.8700");
});

Deno.test("should return null if members doesn't exist", async () => {
  const res = await new GeoDistCommand(["Sicily", "FOO", "BAR"]).exec(client);

  assertEquals(res, null);
});
