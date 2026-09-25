import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.type
 * @see node_modules/@upstash/redis/docs/commands/json/type.mdx
 */
export class JsonTypeCommand extends Command<string[], string[]> {
  constructor(cmd: [key: string, path?: string], opts?: CommandOptions<string[], string[]>) {
    super(["JSON.TYPE", ...cmd], opts);
  }
}
