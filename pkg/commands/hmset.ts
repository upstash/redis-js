import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hmset
 */
export class HMSetCommand<TData> extends Command<"OK", "OK"> {
  constructor(
    [key, kv]: [key: string, kv: Record<string, TData>],
    opts?: CommandOptions<"OK", "OK">
  ) {
    super(["hmset", key, ...Object.entries(kv).flatMap(([field, value]) => [field, value])], opts);
  }
}
