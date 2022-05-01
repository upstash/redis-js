import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/pexpire
 */
export class PExpireCommand extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [key: string, milliseconds: number],
    opts?: CommandOptions<"0" | "1", 0 | 1>,
  ) {
    super(["pexpire", ...cmd], opts);
  }
}
