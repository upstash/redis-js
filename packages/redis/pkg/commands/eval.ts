import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/eval
 * @see node_modules/@upstash/redis/docs/commands/scripts/eval.mdx
 * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
 * automaticDeserialization: false to the Redis constructor to receive raw strings.
 */
export class EvalCommand<TArgs extends unknown[], TData> extends Command<unknown, TData> {
  constructor(
    [script, keys, args]: [script: string, keys: string[], args: TArgs],
    opts?: CommandOptions<unknown, TData>
  ) {
    super(["eval", script, keys.length, ...keys, ...(args ?? [])], opts);
  }
}
