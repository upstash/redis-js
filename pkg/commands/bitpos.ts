import { Command } from "./command";

/**
 * @see https://redis.io/commands/bitpos
 */
export class BitPosCommand extends Command<number, number> {
  constructor(cmd: [key: string, start: number, end: number]) {
    super(["bitpos", ...cmd])
  }
}
