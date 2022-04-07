import { Command } from "./command"

/**
 * @see https://redis.io/commands/hlen
 */
export class HLenCommand extends Command<number, number> {
  constructor(cmd: [key: string]) {
    super(["hlen", ...cmd])
  }
}
