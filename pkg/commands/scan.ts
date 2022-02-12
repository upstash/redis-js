import { Command } from "../command"

/**
 * @see https://redis.io/commands/scan
 */
export class ScanCommand extends Command<[number, string[]]> {
  constructor(pattern: string, cursor: number) {
    super(["scan", pattern, cursor])
  }
}
