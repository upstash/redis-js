import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/zremrangebylex
 */
export class ZRemRangeByLexCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, min: string, max: string],
    opts?: CommandOptions<number, number>,
  ) {
    super(["zremrangebylex", ...cmd], opts);
  }
}
