import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/strlen
 */
export class StrLenCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["strlen", ...cmd], opts);
  }
}
