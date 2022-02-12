import { Command } from "../command"

/**
 * @see https://redis.io/commands/zcard
 */
export class ZCardCommand extends Command<number> {
  constructor(key: string) {
    super(["zcard", key])
  }
}
