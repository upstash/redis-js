import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.forget
 * @see node_modules/@upstash/redis/docs/commands/json/forget.mdx
 */
export class JsonForgetCommand extends Command<number, number> {
  constructor(cmd: [key: string, path?: string], opts?: CommandOptions<number, number>) {
    super(["JSON.FORGET", ...cmd], opts);
  }
}
