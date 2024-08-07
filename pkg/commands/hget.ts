import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hget
 */
export class HGetCommand<TData> extends Command<unknown | null, TData | null> {
  constructor(
    cmd: [key: string, field: string],
    opts?: CommandOptions<unknown | null, TData | null>
  ) {
    super(["hget", ...cmd], opts);
  }
}
