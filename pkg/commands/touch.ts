import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/touch
 */
export class TouchCommand extends Command<number, number> {
  constructor(
    cmd: [...keys: string[]],
    opts?: CommandOptions<number, number>,
  ) {
    super(["touch", ...cmd], opts);
  }
}
