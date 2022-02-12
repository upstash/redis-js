import { Command } from "../command"

/**
 * @see https://redis.io/commands/mget
 */
export class MGetCommand<TData = string> extends Command<TData[]> {
  constructor(...keys: string[]) {
    super(["mget", ...keys])
  }
}
