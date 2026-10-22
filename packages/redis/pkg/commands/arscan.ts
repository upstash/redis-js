import type { CommandOptions } from "./command";
import { Command } from "./command";
import { parseResponse } from "../util";

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
 * Indexes are returned as strings; see `arlen`.
 *
 * @see https://upstash.com/docs/redis/commands/array/arscan
 * @see node_modules/@upstash/redis/docs/commands/array/arscan.mdx
 */
export class ArScanCommand<TData = string> extends Command<unknown[], [string, TData][]> {
  constructor(
    [key, start, end, opts]: [
      key: string,
      start: number | string,
      end: number | string,
      opts?: ArScanOptions,
    ],
    cmdOpts?: CommandOptions<unknown[], [string, TData][]>
  ) {
    const command: unknown[] = ["ARSCAN", key, start, end];
    if (opts?.limit !== undefined) {
      command.push("LIMIT", opts.limit);
    }
    super(command, {
      deserialize: (result) =>
        parseResponse<[number | string, TData][]>(result).map(([index, value]) => [
          String(index),
          value,
        ]),
      ...cmdOpts,
    });
  }
}
