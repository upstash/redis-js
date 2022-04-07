import { Command } from "./command"
/**
 *  @see https://redis.io/commands/zrevrank
 */

export class ZRevRankCommand<TData> extends Command<number | null, number | null> {
  constructor(cmd: [key: string, member: TData]) {
    super(["zrevrank", ...cmd])
  }
}
