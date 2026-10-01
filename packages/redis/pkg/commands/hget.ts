import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hget
 * @see node_modules/@upstash/redis/docs/commands/hash/hget.mdx
 * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
 * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
 * to receive raw strings.
 */
export class HGetCommand<TData> extends Command<unknown | null, TData | null> {
  constructor(
    cmd: [key: string, field: string],
    opts?: CommandOptions<unknown | null, TData | null>
  ) {
    super(["hget", ...cmd], opts);
  }
}
