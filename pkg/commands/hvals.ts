import { Command } from "./command"

/**
 * @see https://redis.io/commands/hvals
 */
export class HValsCommand<TData extends unknown[]> extends Command<TData, unknown[]> {
  constructor(key: string) {
    super(["hvals", key])
  }
}
