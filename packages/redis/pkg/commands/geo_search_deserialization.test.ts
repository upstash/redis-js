import { expect, test } from "bun:test";
import { GeoSearchCommand } from "./geo_search.ts";

const members: [string, unknown][] = [
  ["9007199254740993", "9007199254740993"],
  ["9223372036854775807", "9223372036854775807"],
  ["Palermo", "Palermo"],
  ["42", 42],
  ['{"name":"Palermo"}', { name: "Palermo" }],
];

test.each(members)("deserializes member %s without metadata", (member, expected) => {
  const command = new GeoSearchCommand([
    "places",
    { type: "FROMMEMBER", member },
    { type: "BYRADIUS", radius: 200, radiusType: "KM" },
    "ASC",
  ]);

  expect(command.deserialize([member])).toEqual([{ member: expected }]);
});

test.each(members)("deserializes member %s with metadata", (member, expected) => {
  const command = new GeoSearchCommand([
    "places",
    { type: "FROMMEMBER", member },
    { type: "BYRADIUS", radius: 200, radiusType: "KM" },
    "ASC",
    { withDist: true, withHash: true, withCoord: true },
  ]);

  expect(
    command.deserialize([
      [member, "88.5260", 3_479_099_956_230_698, ["13.361389338970184", "38.1155563954963"]],
    ])
  ).toEqual([
    {
      member: expected,
      dist: 88.526,
      hash: "3479099956230698",
      coord: { long: 13.361_389_338_970_184, lat: 38.115_556_395_496_3 },
    },
  ]);
});
