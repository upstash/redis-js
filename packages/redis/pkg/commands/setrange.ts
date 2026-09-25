import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/setrange
 * @see node_modules/@upstash/redis/docs/commands/string/setrange.mdx
 */
export class SetRangeCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, offset: number, value: string],
    opts?: CommandOptions<number, number>
  ) {
    super(["setrange", ...cmd], opts);
  }
}
