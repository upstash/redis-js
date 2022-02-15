import { Command } from "../command"

/**
 * @see https://redis.io/commands/hmset
 */
export class HMSetCommand<TData = unknown> extends Command<number> {
  constructor(key: string, kv: { [key: string]: TData }) {
    super(["hmset", key, ...Object.entries(kv).flatMap(([field, value]) => [field, value])])
  }
}
