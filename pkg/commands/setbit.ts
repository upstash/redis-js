import { Command } from "../command"
/**
 * @see https://redis.io/commands/setbit
 */

export class SetBitCommand extends Command<0 | 1, "0" | "1"> {
  constructor(key: string, offset: number, value: 0 | 1) {
    super(["setbit", key, offset, value])
  }
}
