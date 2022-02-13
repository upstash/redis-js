import { Command } from "../command"

/**
 * @see https://redis.io/commands/pttl
 */
export class PTtlCommand extends Command<number> {
  constructor(key: string) {
    super(["pttl", key])
  }
}
