import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Returns the length of an array: the highest occupied index plus one. A missing key has length `0`.
 *
 * Because arrays are sparse this can be larger than the number of stored values, see `arcount`.
 *
 *
 * Indexes above `Number.MAX_SAFE_INTEGER` are returned as strings, so the result is
 * `number | string`.
 * @see https://upstash.com/docs/redis/commands/array/arlen
 */
export class ArLenCommand extends Command<number | string, number | string> {
  constructor(cmd: [key: string], opts?: CommandOptions<number | string, number | string>) {
    super(["ARLEN", ...cmd], opts);
  }
}
