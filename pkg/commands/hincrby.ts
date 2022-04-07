import { Command } from "./command"

/**
 * @see https://redis.io/commands/hincrby
 */
export class HIncrByCommand extends Command<number, number> {
  constructor(cmd: [key: string, field: string, increment: number]) {
    super(["hincrby", ...cmd])
  }
}
