import { Command } from "../command"

/**
 * @see https://redis.io/commands/scan
 */
export class ScanCommand extends Command<[number, string[]]> {
  constructor(cursor: number) {
    super(["scan", cursor])
  }
}
