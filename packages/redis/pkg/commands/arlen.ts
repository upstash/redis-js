import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Returns the length of an array: the highest occupied index plus one. A missing key has length `0`.
 *
 * Because arrays are sparse this can be larger than the number of stored values, see `arcount`.
 *
 * @see https://upstash.com/docs/redis/commands/array/arlen
 */
export class ArLenCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["ARLEN", ...cmd], opts);
  }
}
