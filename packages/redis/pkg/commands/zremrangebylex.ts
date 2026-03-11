import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/zremrangebylex
 */
export class ZRemRangeByLexCommand extends Command<number, number> {
  constructor(cmd: [key: string, min: string, max: string], opts?: CommandOptions<number, number>) {
    super(["zremrangebylex", ...cmd], opts);
  }
}
