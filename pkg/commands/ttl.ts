import { Command } from "./command"

/**
 * @see https://redis.io/commands/ttl
 */
export class TtlCommand extends Command<number, number> {
  constructor(cmd: [key: string]) {
    super(["ttl", ...cmd])
  }
}
