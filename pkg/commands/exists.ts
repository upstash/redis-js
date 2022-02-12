import { Command } from "../command"

/**
 * @see https://redis.io/commands/exists
 */
export class ExistsCommand extends Command<number> {
  constructor(...keys: string[]) {
    super(["exists", ...keys])
  }
}
