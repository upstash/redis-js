import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/rpushx
 * @see node_modules/@upstash/redis/docs/commands/list/rpushx.mdx
 */
export class RPushXCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, ...elements: TData[]], opts?: CommandOptions<number, number>) {
    super(["rpushx", ...cmd], opts);
  }
}
