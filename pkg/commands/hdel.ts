import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/hdel
 */
export class HDelCommand extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [key: string, ...fields: string[]],
    opts?: CommandOptions<"0" | "1", 0 | 1>,
  ) {
    super(["hdel", ...cmd], opts);
  }
}
