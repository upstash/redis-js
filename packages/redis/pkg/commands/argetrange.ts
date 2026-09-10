import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Returns every slot in the inclusive range `[start, end]`, with `null` for empty slots.
 *
 * When `start` is greater than `end`, the values are returned from the higher index down.
 * Ranges wider than 1,000,000 indexes are rejected by the server.
 *
 * @see https://upstash.com/docs/redis/commands/array/argetrange
 */
export class ArGetRangeCommand<TData = string> extends Command<unknown[], (TData | null)[]> {
  constructor(
    cmd: [key: string, start: number | string, end: number | string],
    opts?: CommandOptions<unknown[], (TData | null)[]>
  ) {
    super(["ARGETRANGE", ...cmd], opts);
  }
}
