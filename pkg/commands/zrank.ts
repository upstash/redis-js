import { Command } from "../command"
/**
 *  @see https://redis.io/commands/zrank
 */

export class ZRankCommand<TData> extends Command<number | null> {
  constructor(key: string, member: TData) {
    super(["zrank", key, member])
  }
}
