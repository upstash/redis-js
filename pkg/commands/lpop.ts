import { Command } from "../command"

/**
 * @see https://redis.io/commands/lpop
 */
export class LPopCommand<TValue = string> extends Command<TValue | null> {
  constructor(key: string) {
    super(["lpop", key])
  }
}
