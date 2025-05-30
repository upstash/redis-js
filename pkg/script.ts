import { subtle } from "uncrypto";
import type { Redis } from "./redis";
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
 * expect(arg1, "Hello World")
 * ```
 */
export class Script<TResult = unknown> {
  public readonly script: string;
  /**
   * @deprecated This property is initialized to an empty string and will be set in the init method
   * asynchronously. Do not use this property immidiately after the constructor.
   *
   * This property is only exposed for backwards compatibility and will be removed in the
   * future major release.
   */
  public sha1: string;
  private readonly redis: Redis;

  constructor(redis: Redis, script: string) {
    this.redis = redis;
    this.script = script;
    this.sha1 = "";
    void this.init(script);
  }

  /**
   * Initialize the script by computing its SHA-1 hash.
   */
  private async init(script: string): Promise<void> {
    if (this.sha1) return;
    this.sha1 = await this.digest(script);
  }

  /**
   * Send an `EVAL` command to redis.
   */
  public async eval(keys: string[], args: string[]): Promise<TResult> {
    await this.init(this.script);

    return await this.redis.eval(this.script, keys, args);
  }

  /**
   * Calculates the sha1 hash of the script and then calls `EVALSHA`.
   */
  public async evalsha(keys: string[], args: string[]): Promise<TResult> {
    await this.init(this.script);

    return await this.redis.evalsha(this.sha1, keys, args);
  }

  /**
   * Optimistically try to run `EVALSHA` first.
   * If the script is not loaded in redis, it will fall back and try again with `EVAL`.
   *
   * Following calls will be able to use the cached script
   */
  public async exec(keys: string[], args: string[]): Promise<TResult> {
    await this.init(this.script);

    const res = await this.redis.evalsha(this.sha1, keys, args).catch(async (error) => {
      if (error instanceof Error && error.message.toLowerCase().includes("noscript")) {
        return await this.redis.eval(this.script, keys, args);
      }
      throw error;
    });
    return res as TResult;
  }

  /**
   * Compute the sha1 hash of the script and return its hex representation.
   */
  private async digest(s: string): Promise<string> {
    const data = new TextEncoder().encode(s);
    const hashBuffer = await subtle.digest("SHA-1", data);
    const hashArray = [...new Uint8Array(hashBuffer)];
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}
