import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hset
 */
export class HSetCommand<TData> extends Command<number, number> {
  constructor(
    [key, kv]: [key: string, kv: Record<string, TData>],
    opts?: CommandOptions<number, number>
  ) {
    super(["hset", key, ...Object.entries(kv).flatMap(([field, value]) => [field, value])], opts);
  }
}
