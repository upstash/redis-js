import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/expire
 */
export class ExpireCommand extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [key: string, seconds: number],
    opts?: CommandOptions<"0" | "1", 0 | 1>,
  ) {
    super(["expire", ...cmd], opts);
  }
}
