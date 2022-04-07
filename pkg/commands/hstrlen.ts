import { Command } from "./command"

/**
 * @see https://redis.io/commands/hstrlen
 */
export class HStrLenCommand extends Command<number, number> {
  constructor(cmd: [key: string, field: string]) {
    super(["hstrlen", ...cmd])
  }
}
