import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/zremrangebyscore
 */
export class ZRemRangeByScoreCommand extends Command<number, number> {
  constructor(cmd: [key: string, min: number | string, max: number | string], opts?: CommandOptions<number, number>) {
    super(["zremrangebyscore", ...cmd], opts);
  }
}
