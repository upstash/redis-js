import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/del
 */
export class DelCommand extends Command<number, number> {
  constructor(cmd: [...keys: string[]], opts?: CommandOptions<number, number>) {
    super(["del", ...cmd], opts);
  }
}
