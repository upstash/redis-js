import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.mget
 * @see node_modules/@upstash/redis/docs/commands/json/mget.mdx
 */
export class JsonMGetCommand<TData = unknown[]> extends Command<TData, TData> {
  constructor(cmd: [keys: string[], path: string], opts?: CommandOptions<TData, TData>) {
    super(["JSON.MGET", ...cmd[0], cmd[1]], opts);
  }
}
