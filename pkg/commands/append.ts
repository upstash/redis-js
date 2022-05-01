import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/append
 */
export class AppendCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, value: string],
    opts?: CommandOptions<number, number>,
  ) {
    super(["append", ...cmd], opts);
  }
}
