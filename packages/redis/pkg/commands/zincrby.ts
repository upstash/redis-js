import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/zincrby
 * @see node_modules/@upstash/redis/docs/commands/zset/zincrby.mdx
 */
export class ZIncrByCommand<TData> extends Command<number, number> {
  constructor(
    cmd: [key: string, increment: number, member: TData],
    opts?: CommandOptions<number, number>
  ) {
    super(["zincrby", ...cmd], opts);
  }
}
