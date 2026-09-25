import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/randomkey
 * @see node_modules/@upstash/redis/docs/commands/generic/randomkey.mdx
 */
export class RandomKeyCommand extends Command<string | null, string | null> {
  constructor(opts?: CommandOptions<string | null, string | null>) {
    super(["randomkey"], opts);
  }
}
