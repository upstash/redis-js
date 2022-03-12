import { Command } from "./command"

/**
 * @see https://redis.io/commands/hstrlen
 */
export class HStrLenCommand extends Command<number, number> {
  constructor(key: string, field: string) {
    super(["hstrlen", key, field])
  }
}
