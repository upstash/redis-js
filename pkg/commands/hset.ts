import { Command } from "../command"

/**
 * @see https://redis.io/commands/hset
 */
export class HSetCommand<TData> extends Command<number, number> {
  constructor(key: string, field: string, value: TData) {
    super(["hset", key, field, value])
  }
}
