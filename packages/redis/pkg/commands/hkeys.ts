import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hkeys
 * @see node_modules/@upstash/redis/docs/commands/hash/hkeys.mdx
 */
export class HKeysCommand extends Command<string[], string[]> {
  constructor([key]: [key: string], opts?: CommandOptions<string[], string[]>) {
    super(["hkeys", key], opts);
  }
}
