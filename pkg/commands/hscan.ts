import { Command } from "../command"

/**
 * @see https://redis.io/commands/hscan
 */
export class HScanCommand extends Command<[number, string[]], [number, string[]]> {
  constructor(pattern: string, cursor: number) {
    super(["hscan", pattern, cursor])
  }
}
