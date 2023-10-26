import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/pttl
 */
export class PTtlCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["pttl", ...cmd], opts);
  }
}
