import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/srem
 * @see node_modules/@upstash/redis/docs/commands/set/srem.mdx
 */
export class SRemCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, ...members: TData[]], opts?: CommandOptions<number, number>) {
    super(["srem", ...cmd], opts);
  }
}
