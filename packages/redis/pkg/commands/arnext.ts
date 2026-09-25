import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Returns the index the next `arinsert` would write to, without moving the cursor.
 *
 * Returns `"0"` for a missing key or one that was never appended to, and `null` when the cursor is
 * already at the highest supported index. Indexes are returned as strings; see `arlen`.
 *
 * @see https://upstash.com/docs/redis/commands/array/arnext
 * @see node_modules/@upstash/redis/docs/commands/array/arnext.mdx
 */
export class ArNextCommand extends Command<number | string | null, string | null> {
  constructor(cmd: [key: string], opts?: CommandOptions<number | string | null, string | null>) {
    super(["ARNEXT", ...cmd], {
      deserialize: (result) => (result === null ? null : String(result)),
      ...opts,
    });
  }
}
