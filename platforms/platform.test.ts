import { describe, expect, test } from "bun:test";
import { Redis as NodeRedis } from "./nodejs";
import { Redis as CloudflareRedis } from "./cloudflare";
import { Redis as FastlyRedis } from "./fastly";

describe("should allow creating a client without credentials but fail when requesting", () => {
  test("nodejs", () => {
    const redis = new NodeRedis({ url: undefined, token: undefined });

    const throws = redis.get("foo");
    expect(throws).toThrow(
      "[Upstash Redis] Redis client was initialized without url or token." +
        " Failed to execute command."
    );
  });

  test("cloudflare", () => {
    const redis = new CloudflareRedis({ url: undefined, token: undefined });

    const throws = redis.get("foo");
    expect(throws).toThrow(
      "[Upstash Redis] Redis client was initialized without url or token." +
        " Failed to execute command."
    );
  });

  test("fastly", () => {
    const redis = new FastlyRedis({ url: undefined, token: undefined, backend: "upstash-db" });

    const throws = redis.get("foo");
    expect(throws).toThrow(
      "[Upstash Redis] Redis client was initialized without url or token." +
        " Failed to execute command."
    );
  });
});
