import { Command } from "../command"

/**
 * @see https://redis.io/commands/append
 */
export class AppendCommand extends Command<number> {
  constructor(key: string, value: string) {
    super(["append", key, value])
  }
}
