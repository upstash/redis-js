import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Returns the number of occupied slots in an array. A missing key counts as `0`.
 *
 * @see https://upstash.com/docs/redis/commands/array/arcount
 */
export class ArCountCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["ARCOUNT", ...cmd], opts);
  }
}
