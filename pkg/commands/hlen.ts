import { Command } from "../command"

/**
 * @see https://redis.io/commands/hlen
 */
export class HLenCommand extends Command<number> {
  constructor(key: string) {
    super(["hlen", key])
  }
}
