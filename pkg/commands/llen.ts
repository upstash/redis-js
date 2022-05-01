import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/llen
 */
export class LLenCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["llen", ...cmd], opts);
  }
}
