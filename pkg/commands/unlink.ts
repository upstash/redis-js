import { Command } from "../command"

/**
 * @see https://redis.io/commands/unlink
 */
export class UnlinkCommand extends Command<number> {
  constructor(...keys: string[]) {
    super(["unlink", ...keys])
  }
}
