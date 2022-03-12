import { Command } from "./command"

/**
 * @see https://redis.io/commands/randomkey
 */
export class RandomKeyCommand extends Command<string | null, string | null> {
  constructor() {
    super(["randomkey"])
  }
}
