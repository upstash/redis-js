import { Command } from "../command"

/**
 * @see https://redis.io/commands/decr
 */
export class DecrCommand extends Command<number> {
  constructor(key: string) {
    super(["decr", key])
  }
}
