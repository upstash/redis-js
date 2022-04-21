import { Command } from "./command";
/**
 *  @see https://redis.io/commands/zrank
 */

export class ZRankCommand<TData> extends Command<number | null, number | null> {
  constructor(cmd: [key: string, member: TData]) {
    super(["zrank", ...cmd])
  }
}
