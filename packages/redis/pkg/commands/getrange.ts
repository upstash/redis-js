import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/getrange
 * @see node_modules/@upstash/redis/docs/commands/string/getrange.mdx
 */
export class GetRangeCommand extends Command<string, string> {
  constructor(
    cmd: [key: string, start: number, end: number],
    opts?: CommandOptions<string, string>
  ) {
    super(["getrange", ...cmd], opts);
  }
}
