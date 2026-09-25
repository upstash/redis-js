import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/sadd
 * @see node_modules/@upstash/redis/docs/commands/set/sadd.mdx
 */
export class SAddCommand<TData = string> extends Command<number, number> {
  constructor(
    cmd: [key: string, member: TData, ...members: TData[]],
    opts?: CommandOptions<number, number>
  ) {
    super(["sadd", ...cmd], opts);
  }
}
