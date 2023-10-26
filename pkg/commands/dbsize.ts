import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/dbsize
 */
export class DBSizeCommand extends Command<number, number> {
  constructor(opts?: CommandOptions<number, number>) {
    super(["dbsize"], opts);
  }
}
