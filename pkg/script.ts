import { Redis } from "./redis.ts";
import { sha1 as digest } from "https://deno.land/x/sha1@v1.0.3/mod.ts";

/**
 * Creates a new script.
 *
 * Scripts offer the ability to optimistically try to execute a script without having to send the
 * entire script to the server. If the script is loaded on the server, it tries again by sending
 * the entire script. Afterwards, the script is cached on the server.
 *
 * @example
 * ```ts
 * const redis = new Redis({...})
 *
 * const script = redis.createScript<string>("return ARGV[1];")
 * const arg1 = await script.eval([], ["Hello World"])
 * assertEquals(arg1, "Hello World")
 * ```
 */
export class Script<TResult = unknown> {
  public readonly script: string;
  public readonly sha1: string;
  private readonly redis: Redis;

  constructor(redis: Redis, script: string) {
    this.redis = redis;
    this.sha1 = this.digest(script);
    this.script = script;
  }

  /**
   * Send an `EVAL` command to redis.
   */
  public async eval(keys: string[], args: string[]): Promise<TResult> {
    return await this.redis.eval(this.script, keys, args);
  }

  /**
   * Calculates the sha1 hash of the script and then calls `EVALSHA`.
   */
  public async evalsha(keys: string[], args: string[]): Promise<TResult> {
    return await this.redis.evalsha(this.sha1, keys, args);
  }

  /**
   * Optimistically try to run `EVALSHA` first.
   * If the script is not loaded in redis, it will fall back and try again with `EVAL`.
   *
   * Following calls will be able to use the cached script
   */
  public async exec(keys: string[], args: string[]): Promise<TResult> {
    const res = await this.redis.evalsha(this.sha1, keys, args).catch(
      async (err) => {
        if (
          err instanceof Error &&
          err.message.toLowerCase().includes("noscript")
        ) {
          return await this.redis.eval(this.script, keys, args);
        }
        throw err;
      },
    );
    return res as TResult;
  }

  /**
   * Compute the sha1 hash of the script and return its hex representation.
   */
  private digest(s: string): string {
    const hash = digest(s, "utf8", "hex");
    return typeof hash === "string" ? hash : new TextDecoder().decode(hash);
  }
}
