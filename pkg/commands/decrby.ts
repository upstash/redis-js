import { Command } from "../command"

/**
 * @see https://redis.io/commands/decrby
 */
export class DecrByCommand extends Command<number> {
  constructor(key: string, value: number) {
    super(["decrby", key, value])
  }
}
