import { Command } from "../command"

/**
 * @see https://redis.io/commands/smembers
 */
export class SMembersCommand<TData = string> extends Command<TData[]> {
  constructor(key: string) {
    super(["smembers", key])
  }
}
