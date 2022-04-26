import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/getrange
 */
export class GetRangeCommand extends Command<string, string> {
  constructor(key: string, start: number, end: number) {
    super(["getrange", key, start, end]);
  }
}
