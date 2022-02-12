import { Command } from "../command"

/**
 * @see https://redis.io/commands/bitpos
 */
export class BitPosCommand extends Command<number> {
  constructor(key: string, start: number, end: number) {
    super(["bitpos", key, start, end])
  }
}
