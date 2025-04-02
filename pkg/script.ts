import type { Redis } from "./redis";

export class Script<TResult = unknown> {
  public readonly script: string;
  private sha1: string | null = null;
  private readonly redis: Redis;

  constructor(redis: Redis, script: string) {
    this.redis = redis;
    this.script = script;
  }

  public async eval(keys: string[], args: string[]): Promise<TResult> {
    return await this.redis.eval(this.script, keys, args);
  }

  public async evalsha(keys: string[], args: string[]): Promise<TResult> {
    if (!this.sha1) {
      this.sha1 = await this.digest(this.script);
    }
    return await this.redis.evalsha(this.sha1, keys, args);
  }

  public async exec(keys: string[], args: string[]): Promise<TResult> {
    try {
      const sha1 = await this.evalsha(keys, args);
      return sha1;
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes("noscript")) {
        return await this.redis.eval(this.script, keys, args);
      }
      throw error;
    }
  }

  private async digest(s: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(s);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    return [...new Uint8Array(hashBuffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}
