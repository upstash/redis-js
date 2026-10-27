import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/sdiffstore
 * @see node_modules/@upstash/redis/docs/commands/set/sdiffstore.mdx
 */
export class SDiffStoreCommand extends Command<number, number> {
  constructor(
    cmd: [destination: string, ...keys: string[]],
    opts?: CommandOptions<number, number>
  ) {
    super(["sdiffstore", ...cmd], opts);
  }
}
