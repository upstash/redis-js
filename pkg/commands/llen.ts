import { Command } from "../command"

/**
 * @see https://redis.io/commands/llen
 */
export class LLenCommand extends Command<number> {
  constructor(key: string) {
    super(["llen", key])
  }
}
