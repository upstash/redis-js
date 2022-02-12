import { Command } from "../command"

/**
 * @see https://redis.io/commands/rpop
 */
export class RPopCommand<TValue = string> extends Command<TValue | null> {
  constructor(key: string) {
    super(["rpop", key])
  }
}
