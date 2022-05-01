import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/decrby
 */
export class DecrByCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, decrement: number],
    opts?: CommandOptions<number, number>,
  ) {
    super(["decrby", ...cmd], opts);
  }
}
