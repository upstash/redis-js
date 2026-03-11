import { describe, expect, test } from "bun:test";

import { FCallCommand } from "./fcall";

describe("FCALL", () => {
  test("builds correct command", () => {
    const c = new FCallCommand(["myfunc", ["k1", "k2"], ["a"]]);
    expect(c.command).toEqual(["fcall", "myfunc", 2, "k1", "k2", "a"]);
  });
});
