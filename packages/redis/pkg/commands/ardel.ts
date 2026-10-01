import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Empties one or more array slots. Later values are not shifted.
 *
 * Returns the number of slots that held a value.
 *
 * @see https://upstash.com/docs/redis/commands/array/ardel
 * @see node_modules/@upstash/redis/docs/commands/array/ardel.mdx
 */
export class ArDelCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, ...indexes: (number | string)[]],
    opts?: CommandOptions<number, number>
  ) {
    super(["ARDEL", ...cmd], opts);
  }
}
