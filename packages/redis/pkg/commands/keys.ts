import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/keys
 * @see node_modules/@upstash/redis/docs/commands/generic/keys.mdx
 */
export class KeysCommand extends Command<string[], string[]> {
  constructor(cmd: [pattern: string], opts?: CommandOptions<string[], string[]>) {
    super(["keys", ...cmd], opts);
  }
}
