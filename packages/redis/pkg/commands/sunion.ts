import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/sunion
 * @see node_modules/@upstash/redis/docs/commands/set/sunion.mdx
 */
export class SUnionCommand<TData> extends Command<string[], TData[]> {
  constructor(cmd: [key: string, ...keys: string[]], opts?: CommandOptions<string[], TData[]>) {
    super(["sunion", ...cmd], opts);
  }
}
