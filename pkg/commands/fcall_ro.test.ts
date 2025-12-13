import { describe, expect, test } from "bun:test";

import { FCallRoCommand } from "./fcall_ro";

describe("FCALL_RO", () => {
  test("builds correct command", () => {
    const c = new FCallRoCommand<any>(["myfunc", ["k1"], ["a"]] as any);
    expect(c.command).toEqual(["fcall_ro", "myfunc", 1, "k1", "a"]);
  });
});
