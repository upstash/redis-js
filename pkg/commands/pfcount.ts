import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/pfcount
 */
export class PfCountCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, ...keys: string[]],
    opts?: CommandOptions<number, number>,
  ) {
    super(["pfcount", ...cmd], opts);
  }
}
