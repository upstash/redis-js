import { Command } from "../command"

/**
 * @see https://redis.io/commands/hincrby
 */
export class HIncrByCommand extends Command<number> {
  constructor(key: string, field: string, increment: number) {
    super(["hincrby", key, field, increment])
  }
}
