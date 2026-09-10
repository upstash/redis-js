import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Returns the value stored at `index`, or `null` if the slot is empty or the key does not exist.
 *
 * @see https://upstash.com/docs/redis/commands/array/arget
 */
export class ArGetCommand<TData = string> extends Command<unknown | null, TData | null> {
  constructor(
    cmd: [key: string, index: number | string],
    opts?: CommandOptions<unknown | null, TData | null>
  ) {
    super(["ARGET", ...cmd], opts);
  }
}
