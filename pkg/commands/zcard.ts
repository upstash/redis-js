import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/zcard
 */
export class ZCardCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["zcard", ...cmd], opts);
  }
}
