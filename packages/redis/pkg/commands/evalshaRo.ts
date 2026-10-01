import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/evalsha_ro
 * @see node_modules/@upstash/redis/docs/commands/scripts/evalsha_ro.mdx
 * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
 * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
 * to receive raw strings.
 */
export class EvalshaROCommand<TArgs extends unknown[], TData> extends Command<unknown, TData> {
  constructor(
    [sha, keys, args]: [sha: string, keys: string[], args?: TArgs],
    opts?: CommandOptions<unknown, TData>
  ) {
    super(["evalsha_ro", sha, keys.length, ...keys, ...(args ?? [])], opts);
  }
}
