import { Command } from "../command"

/**
 * @see https://redis.io/commands/hget
 */
export class HGetCommand<TData> extends Command<TData | null> {
  constructor(key: string, field: string) {
    super(["hget", key, field])
  }
}
