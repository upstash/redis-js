import { Command } from "../command"

/**
 * @see https://redis.io/commands/rpop
 */
export class RPopCommand<TData = string> extends Command<TData | null, unknown | null> {
  constructor(key: string) {
    super(["rpop", key])
  }
}
