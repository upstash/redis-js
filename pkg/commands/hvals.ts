import { Command } from "../command"

/**
 * @see https://redis.io/commands/hvals
 */
export class HValsCommand<TValues extends unknown[]> extends Command<TValues> {
  constructor(key: string) {
    super(["hvals", key])
  }
}
