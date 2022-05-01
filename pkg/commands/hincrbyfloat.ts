import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/hincrbyfloat
 */
export class HIncrByFloatCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, field: string, increment: number],
    opts?: CommandOptions<number, number>,
  ) {
    super(["hincrbyfloat", ...cmd], opts);
  }
}
