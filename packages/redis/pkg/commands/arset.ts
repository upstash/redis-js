import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Writes one or more values into an array, starting at `index`: the first value goes to `index`,
 * the next to `index + 1`, and so on.
 *
 * Returns the number of slots that were newly occupied. Overwriting an existing value contributes `0`.
 *
 * @see https://upstash.com/docs/redis/commands/array/arset
 */
export class ArSetCommand<TData = string> extends Command<number, number> {
  constructor(
    cmd: [key: string, index: number | string, ...values: TData[]],
    opts?: CommandOptions<number, number>
  ) {
    super(["ARSET", ...cmd], opts);
  }
}
