import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Appends one or more values after the array's append cursor.
 *
 * Returns the index the last value was written to (not the number of values written).
 *
 * Indexes are returned as strings; see `arlen`.
 *
 * @see https://upstash.com/docs/redis/commands/array/arinsert
 * @see node_modules/@upstash/redis/docs/commands/array/arinsert.mdx
 */
export class ArInsertCommand<TData = string> extends Command<number | string, string> {
  constructor(
    cmd: [key: string, ...values: TData[]],
    opts?: CommandOptions<number | string, string>
  ) {
    super(["ARINSERT", ...cmd], {
      deserialize: String,
      ...opts,
    });
  }
}
