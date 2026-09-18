import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Empties every occupied slot inside one or more inclusive `[start, end]` ranges.
 *
 * Returns the total number of values removed across all ranges.
 *
 * @see https://upstash.com/docs/redis/commands/array/ardelrange
 */
export class ArDelRangeCommand extends Command<number, number> {
  constructor(
    [key, ...ranges]: [key: string, ...ranges: [start: number | string, end: number | string][]],
    opts?: CommandOptions<number, number>
  ) {
    super(["ARDELRANGE", key, ...ranges.flat()], opts);
  }
}
