import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.del
 * @see node_modules/@upstash/redis/docs/commands/json/del.mdx
 */
export class JsonDelCommand extends Command<number, number> {
  constructor(cmd: [key: string, path?: string], opts?: CommandOptions<number, number>) {
    super(["JSON.DEL", ...cmd], opts);
  }
}
