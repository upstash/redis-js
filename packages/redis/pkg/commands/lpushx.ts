import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/lpushx
 * @see node_modules/@upstash/redis/docs/commands/list/lpushx.mdx
 */
export class LPushXCommand<TData> extends Command<number, number> {
  constructor(cmd: [key: string, ...elements: TData[]], opts?: CommandOptions<number, number>) {
    super(["lpushx", ...cmd], opts);
  }
}
