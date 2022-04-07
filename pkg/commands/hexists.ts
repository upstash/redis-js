import { Command } from "./command"

/**
 * @see https://redis.io/commands/hexists
 */
export class HExistsCommand extends Command<number, number> {
  constructor(cmd: [key: string, field: string]) {
    super(["hexists", ...cmd])
  }
}
