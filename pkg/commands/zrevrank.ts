import { Command, CommandOptions } from "./command.ts";
/**
 *  @see https://redis.io/commands/zrevrank
 */

export class ZRevRankCommand<TData>
  extends Command<number | null, number | null> {
  constructor(
    cmd: [key: string, member: TData],
    opts?: CommandOptions<number | null, number | null>,
  ) {
    super(["zrevrank", ...cmd], opts);
  }
}
