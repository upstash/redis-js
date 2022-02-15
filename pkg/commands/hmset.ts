import { Command } from "../command"

/**
 * @see https://redis.io/commands/hmset
 */
export class HMSetCommand<TData = unknown> extends Command<number> {
  constructor(key: string, ...kv: { field: string; value: TData }[]) {
    super(["hmset", key, ...kv.flatMap(({ field, value }) => [field, value])])
  }
}
