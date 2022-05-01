import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/bitpos
 */
export class BitPosCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, start: number, end: number],
    opts?: CommandOptions<number, number>,
  ) {
    super(["bitpos", ...cmd], opts);
  }
}
