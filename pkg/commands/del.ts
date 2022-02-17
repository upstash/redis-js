import { Command } from "../command"

/**
 * @see https://redis.io/commands/del
 */
export class DelCommand extends Command<number, number> {
  constructor(...keys: string[]) {
    super(["del", ...keys])
  }
}
