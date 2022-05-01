import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/zremrangebyrank
 */
export class ZRemRangeByRankCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, start: number, stop: number],
    opts?: CommandOptions<number, number>,
  ) {
    super(["zremrangebyrank", ...cmd], opts);
  }
}
