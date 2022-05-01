import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/hlen
 */
export class HLenCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["hlen", ...cmd], opts);
  }
}
