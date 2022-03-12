import { Command } from "./command"
/**
 * @see https://redis.io/commands/zremrangebyscore
 */
export class ZRemRangeByScoreCommand extends Command<number, number> {
  constructor(key: string, min: number, max: number) {
    super(["zremrangebyscore", key, min, max])
  }
}
