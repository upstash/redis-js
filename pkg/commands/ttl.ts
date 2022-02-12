import { Command } from "../command"

/**
 * @see https://redis.io/commands/ttl
 */
export class TtlCommand extends Command<number> {
  constructor(key: string) {
    super(["ttl", key])
  }
}
