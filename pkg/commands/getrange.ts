import { Command } from "../command"

/**
 * @see https://redis.io/commands/getrange
 */
export class GetRangeCommand extends Command<string | null> {
  constructor(key: string, start: number, end: number) {
    super(["getrange", key, start, end])
  }
}
