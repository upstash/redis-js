import { Command } from "../command"

/**
 * @see https://redis.io/commands/hget
 */
export class HGetCommand<TValue> extends Command<TValue | null> {
  constructor(key: string, field: string) {
    super(["hget", key, field])
  }
}
