import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/sunionstore
 * @see node_modules/@upstash/redis/docs/commands/set/sunionstore.mdx
 */
export class SUnionStoreCommand extends Command<number, number> {
  constructor(
    cmd: [destination: string, key: string, ...keys: string[]],
    opts?: CommandOptions<number, number>
  ) {
    super(["sunionstore", ...cmd], opts);
  }
}
