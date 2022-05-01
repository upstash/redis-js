import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/hincrby
 */
export class HIncrByCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, field: string, increment: number],
    opts?: CommandOptions<number, number>,
  ) {
    super(["hincrby", ...cmd], opts);
  }
}
