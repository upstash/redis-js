import { Command } from "../command"

/**
 * @see https://redis.io/commands/mget
 */
export class MGetCommand<TData extends unknown[]> extends Command<TData> {
  constructor(...keys: string[]) {
    super(["mget", ...keys])
  }
}
