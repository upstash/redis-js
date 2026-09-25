import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.clear
 * @see node_modules/@upstash/redis/docs/commands/json/clear.mdx
 */
export class JsonClearCommand extends Command<number, number> {
  constructor(cmd: [key: string, path?: string], opts?: CommandOptions<number, number>) {
    super(["JSON.CLEAR", ...cmd], opts);
  }
}
