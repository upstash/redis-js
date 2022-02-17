import { Command } from "../command"

/**
 * @see https://redis.io/commands/scan
 */
export class ScanCommand extends Command<[number, string[]], [number, string[]]> {
  constructor(cursor: number, match?: string, count?: number) {
    const command = ["scan", cursor]
    if (match) {
      command.push("match", match)
    }
    if (typeof count === "number") {
      command.push("count", count)
    }
    super(command)
  }
}
