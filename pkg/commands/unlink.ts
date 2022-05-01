import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/unlink
 */
export class UnlinkCommand extends Command<number, number> {
  constructor(cmd: [...keys: string[]], opts?: CommandOptions<number, number>) {
    super(["unlink", ...cmd], opts);
  }
}
