import { Command } from "./command"

/**
 * @see https://redis.io/commands/smembers
 */
export class SMembersCommand<TData = string> extends Command<TData[], unknown[]> {
  constructor(cmd: [key: string]) {
    super(["smembers", ...cmd])
  }
}
