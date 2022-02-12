import { Command } from "../command"

/**
 * @see https://redis.io/commands/smembers
 */
export class SMembersCommand<TValue = string> extends Command<TValue[]> {
  constructor(key: string) {
    super(["smembers", key])
  }
}
