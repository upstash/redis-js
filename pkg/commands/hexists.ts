import { Command } from "../command"

/**
 * @see https://redis.io/commands/hexists
 */
export class HExistsCommand extends Command<number> {
  constructor(key: string, field: string) {
    super(["hexists", key, field])
  }
}
