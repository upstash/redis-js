import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Appends one or more values after the array's append cursor.
 *
 * Returns the index the last value was written to (not the number of values written).
 *
 *
 * Indexes above `Number.MAX_SAFE_INTEGER` are returned as strings, so the result is
 * `number | string`.
 * @see https://upstash.com/docs/redis/commands/array/arinsert
 */
export class ArInsertCommand<TData = string> extends Command<number | string, number | string> {
  constructor(
    cmd: [key: string, ...values: TData[]],
    opts?: CommandOptions<number | string, number | string>
  ) {
    super(["ARINSERT", ...cmd], opts);
  }
}
