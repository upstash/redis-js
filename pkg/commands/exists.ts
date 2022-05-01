import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/exists
 */
export class ExistsCommand extends Command<number, number> {
  constructor(
    cmd: [...keys: string[]],
    opts?: CommandOptions<number, number>,
  ) {
    super(["exists", ...cmd], opts);
  }
}
