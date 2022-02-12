import { Command } from "../command"

/**
 * @see https://redis.io/commands/dbsize
 */
export class DBSizeCommand extends Command<number> {
  constructor() {
    super(["dbsize"])
  }
}
