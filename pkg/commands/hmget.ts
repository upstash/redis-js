import { Command } from "../command"

/**
 * @see https://redis.io/commands/hmget
 */
export class HMGetCommand<TValues extends unknown[]> extends Command<TValues> {
  constructor(key: string, ...fields: string[]) {
    super(["hmget", key, ...fields])
  }
}
