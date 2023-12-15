import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/xlen
 */
export class XLenCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["XLEN", ...cmd], opts);
  }
}
