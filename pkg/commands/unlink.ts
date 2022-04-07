import { Command } from "./command"

/**
 * @see https://redis.io/commands/unlink
 */
export class UnlinkCommand extends Command<number, number> {
  constructor(cmd: [...keys: string[]]) {
    super(["unlink", ...cmd])
  }
}
