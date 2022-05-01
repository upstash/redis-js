import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/pexpireat
 */
export class PExpireAtCommand extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [key: string, unix: number],
    opts?: CommandOptions<"0" | "1", 0 | 1>,
  ) {
    super(["pexpireat", ...cmd], opts);
  }
}
