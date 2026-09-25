import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/zdiffstore
 * @see node_modules/@upstash/redis/docs/commands/zset/zdiffstore.mdx
 */
export class ZDiffStoreCommand extends Command<number, number> {
  constructor(
    cmd: [destination: string, numkeys: number, ...keys: string[]],
    opts?: CommandOptions<number, number>
  ) {
    super(["zdiffstore", ...cmd], opts);
  }
}
