import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Returns the length of an array: the highest occupied index plus one. A missing key has length `0`.
 *
 * Because arrays are sparse this can be larger than the number of stored values, see `arcount`.
 *
 * Indexes are returned as strings: they run up to 2^64-2, past what a JavaScript number can hold
 * exactly. This matches how the SDK keeps the `scan` cursor a string, and the value can be passed
 * straight back into any command that takes an index.
 *
 * @see https://upstash.com/docs/redis/commands/array/arlen
 * @see node_modules/@upstash/redis/docs/commands/array/arlen.mdx
 */
export class ArLenCommand extends Command<number | string, string> {
  constructor(cmd: [key: string], opts?: CommandOptions<number | string, string>) {
    super(["ARLEN", ...cmd], {
      deserialize: String,
      ...opts,
    });
  }
}
