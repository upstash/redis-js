import { Command } from "../command"

/**
 * @see https://redis.io/commands/hset
 */
export class HSetCommand<TValue> extends Command<number> {
  constructor(key: string, field: string, value: TValue) {
    super(["hset", key, field, value])
  }
}
