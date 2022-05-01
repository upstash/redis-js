import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/scard
 */
export class SCardCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["scard", ...cmd], opts);
  }
}
