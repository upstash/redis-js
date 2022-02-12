import { Command } from "../command"

/**
 * @see https://redis.io/commands/incr
 */
export class IncrCommand extends Command<number> {
  constructor(key: string) {
    super(["incr", key])
  }
}
