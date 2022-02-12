import { Command } from "../command"

/**
 * @see https://redis.io/commands/hmset
 */
export class HMSetCommand extends Command<number> {
  constructor(key: string, ...kv: { field: string; value: unknown }[]) {
    super(["hmset", key, ...kv.flatMap(({ field, value }) => [field, value])])
  }
}
