import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 *  @see https://redis.io/commands/zrevrank
 */

export class ZRevRankCommand<TData> extends Command<number | null, number | null> {
  constructor(
    cmd: [key: string, member: TData],
    opts?: CommandOptions<number | null, number | null>
  ) {
    super(["zrevrank", ...cmd], opts);
  }
}
