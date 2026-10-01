import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/get
 * @see node_modules/@upstash/redis/docs/commands/string/get.mdx
 * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
 * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
 * to receive raw strings.
 */
export class GetCommand<TData = string> extends Command<unknown | null, TData | null> {
  constructor(cmd: [key: string], opts?: CommandOptions<unknown | null, TData | null>) {
    super(["get", ...cmd], opts);
  }
}
