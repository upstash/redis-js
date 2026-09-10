import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Moves the append cursor so that the next `arinsert` writes to `index`. Stored values are not
 * touched.
 *
 * Returns `1` if the cursor was moved, `0` if the key does not exist.
 *
 * @see https://upstash.com/docs/redis/commands/array/arseek
 */
export class ArSeekCommand extends Command<0 | 1, 0 | 1> {
  constructor(cmd: [key: string, index: number | string], opts?: CommandOptions<0 | 1, 0 | 1>) {
    super(["ARSEEK", ...cmd], opts);
  }
}
