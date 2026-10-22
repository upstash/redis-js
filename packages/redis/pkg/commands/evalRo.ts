import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/eval_ro
 * @see node_modules/@upstash/redis/docs/commands/scripts/eval_ro.mdx
 * Responses are JSON-parsed automatically: a stored "123" comes back as the number 123, "true" as
 * true, and '{"a":1}' as an object. Pass automaticDeserialization: false to the Redis constructor
 * to receive raw strings.
 */
export class EvalROCommand<TArgs extends unknown[], TData> extends Command<unknown, TData> {
  constructor(
    [script, keys, args]: [script: string, keys: string[], args: TArgs],
    opts?: CommandOptions<unknown, TData>
  ) {
    super(["eval_ro", script, keys.length, ...keys, ...(args ?? [])], opts);
  }
}
