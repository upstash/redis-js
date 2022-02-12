import { Command } from "../command"
/**
 *  @see https://redis.io/commands/zrank
 */

export class ZRankCommand extends Command<number | null> {
  constructor(key: string, member: string) {
    super(["zrank", key, member])
  }
}
