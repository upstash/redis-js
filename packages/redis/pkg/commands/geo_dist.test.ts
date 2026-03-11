import { expect, test } from "bun:test";
import { newHttpClient } from "../test-utils";

import { GeoAddCommand } from "./geo_add";
import { GeoDistCommand } from "./geo_dist";

const client = newHttpClient();

test("should return distance successfully in meters", async () => {
  await new GeoAddCommand([
    "Sicily",
    { longitude: 13.361_389, latitude: 38.115_556, member: "Palermo" },
    { longitude: 15.087_269, latitude: 37.502_669, member: "Catania" },
  ]).exec(client);

  const res = await new GeoDistCommand(["Sicily", "Palermo", "Catania"]).exec(client);

  expect(res).toEqual(166_274.1516);
});

test("should return distance for object members", async () => {
  await new GeoAddCommand([
    "Sicily",
    { longitude: 13.361_389, latitude: 38.115_556, member: { name: "Palermo" } },
    { longitude: 15.087_269, latitude: 37.502_669, member: { name: "Catania" } },
  ]).exec(client);

  const res = await new GeoDistCommand([
    "Sicily",
    { name: "Palermo" },
    {
      name: "Catania",
    },
  ]).exec(client);

  expect(res).toEqual(166_274.1516);
});

test("should return distance successfully in kilometers", async () => {
  await new GeoAddCommand([
    "Sicily",
    { longitude: 13.361_389, latitude: 38.115_556, member: "Palermo" },
    { longitude: 15.087_269, latitude: 37.502_669, member: "Catania" },
  ]).exec(client);

  const res = await new GeoDistCommand(["Sicily", "Palermo", "Catania", "KM"]).exec(client);

  expect(res).toEqual(166.2742);
});

test("should return distance successfully in miles", async () => {
  await new GeoAddCommand([
    "Sicily",
    { longitude: 13.361_389, latitude: 38.115_556, member: "Palermo" },
    { longitude: 15.087_269, latitude: 37.502_669, member: "Catania" },
  ]).exec(client);

  const res = await new GeoDistCommand(["Sicily", "Palermo", "Catania", "MI"]).exec(client);

  expect(res).toEqual(103.3182);
});

test("should return distance successfully in feet", async () => {
  await new GeoAddCommand([
    "Sicily",
    { longitude: 13.361_389, latitude: 38.115_556, member: "Palermo" },
    { longitude: 15.087_269, latitude: 37.502_669, member: "Catania" },
  ]).exec(client);

  const res = await new GeoDistCommand(["Sicily", "Palermo", "Catania", "FT"]).exec(client);

  expect(res?.toString()).toEqual("545518.8700");
});

test("should return null if members doesn't exist", async () => {
  const res = await new GeoDistCommand(["Sicily", "FOO", "BAR"]).exec(client);

  expect(res).toEqual(null);
});
