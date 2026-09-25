import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Returns the values at several indexes, in the order the indexes were given, with `null` for
 * empty slots.
 *
 * @see https://upstash.com/docs/redis/commands/array/armget
 */
export class ArMGetCommand<TData = string> extends Command<unknown[], (TData | null)[]> {
  constructor(
    cmd: [key: string, ...indexes: (number | string)[]],
    opts?: CommandOptions<unknown[], (TData | null)[]>
  ) {
    super(["ARMGET", ...cmd], opts);
  }
}
