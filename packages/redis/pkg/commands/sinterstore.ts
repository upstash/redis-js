import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/sinterstore
 * @see node_modules/@upstash/redis/docs/commands/set/sinterstore.mdx
 */
export class SInterStoreCommand extends Command<number, number> {
  constructor(
    cmd: [destination: string, key: string, ...keys: string[]],
    opts?: CommandOptions<number, number>
  ) {
    super(["sinterstore", ...cmd], opts);
  }
}
