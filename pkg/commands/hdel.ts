import { Command } from "../command"

/**
 * @see https://redis.io/commands/hdel
 */
export class HDelCommand extends Command<0 | 1> {
  constructor(key: string, field: string) {
    super(["hdel", key, field])
  }
}
