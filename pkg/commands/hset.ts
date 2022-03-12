import { Command } from "./command"

/**
 * @see https://redis.io/commands/hset
 */
export class HSetCommand<TData> extends Command<number, number> {
  constructor(key: string, kv: { [field: string]: TData }) {
    super(["hset", key, ...Object.entries(kv).flatMap(([field, value]) => [field, value])])
  }
}
