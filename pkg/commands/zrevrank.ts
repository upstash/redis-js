import { Command } from "../command"
/**
 *  @see https://redis.io/commands/zrevrank
 */

export class ZRevRankCommand extends Command<number | null> {
  constructor(key: string, member: string) {
    super(["zrevrank", key, member])
  }
}
