import type { CommandOptions } from "./command";
import { Command } from "./command";

export type ArScanOptions = {
  /**
   * Maximum number of slots to return.
   */
  limit?: number;
};

/**
 * Returns the occupied slots in the inclusive range `[start, end]` as `[index, value]` pairs, in
 * ascending index order. Empty slots are skipped.
 *
 * Indexes above `Number.MAX_SAFE_INTEGER` are returned as strings.
 *
 * @see https://upstash.com/docs/redis/commands/array/arscan
 */
export class ArScanCommand<TData = string> extends Command<unknown[], [number | string, TData][]> {
  constructor(
    [key, start, end, opts]: [
      key: string,
      start: number | string,
      end: number | string,
      opts?: ArScanOptions,
    ],
    cmdOpts?: CommandOptions<unknown[], [number | string, TData][]>
  ) {
    const command: unknown[] = ["ARSCAN", key, start, end];
    if (opts?.limit !== undefined) {
      command.push("LIMIT", opts.limit);
    }
    super(command, cmdOpts);
  }
}
