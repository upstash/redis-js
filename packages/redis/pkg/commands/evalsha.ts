import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/evalsha
 * @see node_modules/@upstash/redis/docs/commands/scripts/evalsha.mdx
 * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
 * automaticDeserialization: false to the Redis constructor to receive raw strings.
 */
export class EvalshaCommand<TArgs extends unknown[], TData> extends Command<unknown, TData> {
  constructor(
    [sha, keys, args]: [sha: string, keys: string[], args?: TArgs],
    opts?: CommandOptions<unknown, TData>
  ) {
    super(["evalsha", sha, keys.length, ...keys, ...(args ?? [])], opts);
  }
}
