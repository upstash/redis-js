import { Command } from "../command"
/**
 * @see https://redis.io/commands/zremrangebyrank
 */
export class ZRemRangeByRankCommand extends Command<number> {
  constructor(key: string, start: number, stop: number) {
    super(["zremrangebyrank", key, start, stop])
  }
}
