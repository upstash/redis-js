import { Command } from "./command"

/**
 * @see https://redis.io/commands/getrange
 */
export class GetRangeCommand extends Command<string, string> {
  constructor(cmd: [key: string, start: number, end: number]) {
    super(["getrange", ...cmd])
  }
}
