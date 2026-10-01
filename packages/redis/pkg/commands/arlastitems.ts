import type { CommandOptions } from "./command";
import { Command } from "./command";

export type ArLastItemsOptions = {
  /**
   * Return the newest value first instead of last.
   */
  rev?: boolean;
};

/**
 * Returns up to `count` of the most recently appended values, walking backwards from the append
 * cursor. Values come back oldest-first unless `rev` is set.
 *
 * @see https://upstash.com/docs/redis/commands/array/arlastitems
 * @see node_modules/@upstash/redis/docs/commands/array/arlastitems.mdx
 */
export class ArLastItemsCommand<TData = string> extends Command<unknown[], (TData | null)[]> {
  constructor(
    [key, count, opts]: [key: string, count: number, opts?: ArLastItemsOptions],
    cmdOpts?: CommandOptions<unknown[], (TData | null)[]>
  ) {
    const command: unknown[] = ["ARLASTITEMS", key, count];
    if (opts?.rev) {
      command.push("REV");
    }
    super(command, cmdOpts);
  }
}
