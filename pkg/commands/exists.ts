import { NonEmptyArray } from "../types"
import { Command } from "../command"

/**
 * @see https://redis.io/commands/exists
 */
export class ExistsCommand extends Command<0 | 1, "0" | "1"> {
  constructor(...keys: NonEmptyArray<string>) {
    super(["exists", ...keys])
  }
}
