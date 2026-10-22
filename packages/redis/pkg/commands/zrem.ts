import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/zrem
 * @see node_modules/@upstash/redis/docs/commands/zset/zrem.mdx
 */
export class ZRemCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, ...members: TData[]], opts?: CommandOptions<number, number>) {
    super(["zrem", ...cmd], opts);
  }
}
