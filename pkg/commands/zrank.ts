import { Command, CommandOptions } from "./command.ts";
/**
 *  @see https://redis.io/commands/zrank
 */

export class ZRankCommand<TData> extends Command<number | null, number | null> {
  constructor(
    cmd: [key: string, member: TData],
    opts?: CommandOptions<number | null, number | null>,
  ) {
    super(["zrank", ...cmd], opts);
  }
}
