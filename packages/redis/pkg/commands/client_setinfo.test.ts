import { describe, expect, test } from "bun:test";
import { ClientSetInfoCommand } from "./client_setinfo";

describe("CLIENT SETINFO command", () => {
  // Note: CLIENT commands are not supported in Upstash REST API
  // These tests only verify command structure

  test("command structure with LIB-NAME", () => {
    const cmd = new ClientSetInfoCommand(["LIB-NAME", "redis-js"]);
    expect(cmd.command).toEqual(["CLIENT", "SETINFO", "LIB-NAME", "redis-js"]);
  });

  test("command structure with LIB-VER", () => {
    const cmd = new ClientSetInfoCommand(["LIB-VER", "1.0.0"]);
    expect(cmd.command).toEqual(["CLIENT", "SETINFO", "LIB-VER", "1.0.0"]);
  });

  test("normalizes lowercase lib-name to uppercase", () => {
    const cmd = new ClientSetInfoCommand(["lib-name", "redis-js"]);
    expect(cmd.command).toEqual(["CLIENT", "SETINFO", "LIB-NAME", "redis-js"]);
  });

  test("normalizes lowercase lib-ver to uppercase", () => {
    const cmd = new ClientSetInfoCommand(["lib-ver", "2.0.0"]);
    expect(cmd.command).toEqual(["CLIENT", "SETINFO", "LIB-VER", "2.0.0"]);
  });

  test("handles library with custom suffix", () => {
    const cmd = new ClientSetInfoCommand(["LIB-NAME", "redis-js(upstash_v1.0.0)"]);
    expect(cmd.command).toEqual(["CLIENT", "SETINFO", "LIB-NAME", "redis-js(upstash_v1.0.0)"]);
  });

  test("handles version with dots", () => {
    const cmd = new ClientSetInfoCommand(["LIB-VER", "3.2.1"]);
    expect(cmd.command).toEqual(["CLIENT", "SETINFO", "LIB-VER", "3.2.1"]);
  });
});
