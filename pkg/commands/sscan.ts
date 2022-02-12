import { Command } from "../command"

/**
 * @see https://redis.io/commands/sscan
 */
export class SScanCommand extends Command<[number, string[]]> {
  constructor(pattern: string, cursor: number) {
    super(["sscan", pattern, cursor])
  }
}
