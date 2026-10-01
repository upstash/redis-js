import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/xdel
 * @see node_modules/@upstash/redis/docs/commands/stream/xdel.mdx
 */
export class XDelCommand extends Command<number, number> {
  constructor(
    [key, ids]: [key: string, ids: string[] | string],
    opts?: CommandOptions<number, number>
  ) {
    const cmds = Array.isArray(ids) ? [...ids] : [ids];
    super(["XDEL", key, ...cmds], opts);
  }
}
