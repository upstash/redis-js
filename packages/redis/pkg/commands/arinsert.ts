import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Appends one or more values after the array's append cursor.
 *
 * Returns the index the last value was written to (not the number of values written).
 *
 * @see https://upstash.com/docs/redis/commands/array/arinsert
 */
export class ArInsertCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, ...values: TData[]], opts?: CommandOptions<number, number>) {
    super(["ARINSERT", ...cmd], opts);
  }
}
