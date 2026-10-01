import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/sdiff
 * @see node_modules/@upstash/redis/docs/commands/set/sdiff.mdx
 */
export class SDiffCommand<TData> extends Command<unknown[], TData[]> {
  constructor(cmd: [key: string, ...keys: string[]], opts?: CommandOptions<unknown[], TData[]>) {
    super(["sdiff", ...cmd], opts);
  }
}
