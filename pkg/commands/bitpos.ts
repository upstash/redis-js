import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/bitpos
 */
export class BitPosCommand extends Command<number, number> {
  constructor(key: string, start: number, end: number) {
    super(["bitpos", key, start, end]);
  }
}
