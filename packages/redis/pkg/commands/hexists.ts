import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hexists
 * @see node_modules/@upstash/redis/docs/commands/hash/hexists.mdx
 */
export class HExistsCommand extends Command<number, number> {
  constructor(cmd: [key: string, field: string], opts?: CommandOptions<number, number>) {
    super(["hexists", ...cmd], opts);
  }
}
