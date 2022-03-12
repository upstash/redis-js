import { Command } from "./command"

/**
 * @see https://redis.io/commands/decr
 */
export class DecrCommand extends Command<number, number> {
  constructor(key: string) {
    super(["decr", key])
  }
}
