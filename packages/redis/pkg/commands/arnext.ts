import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Returns the index the next `arinsert` would write to, without moving the cursor.
 *
 * Returns `0` for a missing key or one that was never appended to, and `null` when the cursor is
 * already at the highest supported index.
 *
 * @see https://upstash.com/docs/redis/commands/array/arnext
 */
export class ArNextCommand extends Command<number | string | null, number | string | null> {
  constructor(
    cmd: [key: string],
    opts?: CommandOptions<number | string | null, number | string | null>
  ) {
    super(["ARNEXT", ...cmd], opts);
  }
}
